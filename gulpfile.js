var gulp = require('gulp');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var del = require('del');
var ecstatic = require("ecstatic");
var gutil = require('gulp-util');
var ngHtml2Js = require("gulp-ng-html2js");
var http = require('http');
var inject = require("gulp-inject");
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var merge = require('merge-stream');
var minifyHtml = require("gulp-minify-html");
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var stylish = require('jshint-stylish');
var uglify = require("gulp-uglify");
var watch = require('gulp-watch');
var wrap = require("gulp-wrap");

// require package.json and our build configuration.
var pkg = require('./package.json');
var config = require('./build.config.js');

/**
 * Compiles our SCSS, renames it to match our package.json file, and moves it into our build directory.
 */
gulp.task('sass', function() {
    return gulp.src(config.appFiles.scss)
        .pipe(plumber())
        .pipe(sass())
        .pipe(rename(function(path) {
            path.basename = pkg.name + '-' + pkg.version;
        }))
        .pipe(gulp.dest(config.buildDir + '/assets'));
});

/**
 * Cleans our /build and /dist folders before we start our build.
 */
gulp.task('clean', function() {
    return del([config.buildDir, config.prodDir]);
});

/**
 * Does the appropriate copying of our files into the proper
 * build directories. Only copy the changes files.
 */
gulp.task('copy', function() {

    var assets = gulp.src('src/assets/**/*', {
            base: 'src/assets/'
        })
        .pipe(changed(config.buildDir + '/assets'))
        .pipe(gulp.dest(config.buildDir + '/assets'));

    var appJS = gulp.src(config.appFiles.js)
        .pipe(changed(config.buildDir + '/src'))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(gulp.dest(config.buildDir + '/src'));

    var vendorJS = gulp.src(config.vendorFiles.js, { base: '.' })
        .pipe(changed(config.buildDir))
        .pipe(gulp.dest(config.buildDir));

    var vendorCSS = gulp.src(config.vendorFiles.css, { base: '.' })
        .pipe(changed(config.buildDir))
        .pipe(gulp.dest(config.buildDir));

    return merge([assets, appJS, vendorJS, vendorCSS]);
});

/**
 * Compiles our index.html and does things
 */
gulp.task('index', function() {
    var target = gulp.src('src/index.html');
    var files = [].concat(
        config.vendorFiles.js,
        'src/**/*.js',
        config.vendorFiles.css,
        'templates-app.js',
        'assets/' + pkg.name + '-' + pkg.version + '.css'
    );
    var sources = gulp.src(files, {
        read: false,
        cwd: config.buildDir,
    });

    // inject the files, and copy it to the build directory
    return target.pipe(inject(sources, { addRootSlash: false }))
        .pipe(gulp.dest(config.buildDir));
});



/**
 * Compiles all of our application templates (*.tpl.html) into angular modules
 * using $templateCache
 */
gulp.task('html2js', function() {
    return gulp.src(config.appFiles.templates)
        .pipe(plumber())
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: 'templates-app'
        }))
        .pipe(concat('templates-app.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(config.buildDir));
});


/**
 * Setup livereload to watch our build directory for changes, and reload.
 */
gulp.task('livereload', function() {
    livereload.listen();
    gulp.watch(config.buildDir + '/**').on('change', livereload.changed);
});


/**
 * Spin up a really simple node server to do development on.
 */
gulp.task('server', function() {
    http.createServer(ecstatic({root: __dirname + '/build'})).listen(1337);
    gutil.log(gutil.colors.blue('HTTP server listening on port 1337'));
});

/**
 * Runs jsHint on all of our application javascript and runs
 * it through a pretty reporter.
 */
 gulp.task('jshint', function() {
     var options = {
         curly: true,
         immed: true,
         newcap: true,
         noarg: true,
         sub: true,
         boss: true,
         eqnull: true,
         globalstrict: true
     };

     return gulp.src(config.appFiles.js)
         .pipe(jshint(options))
         .pipe(jshint.reporter(stylish))
         .pipe(jshint.reporter('fail'));
 });


/**
 * Watches all of our source files, and runs the appropriate task
 */
gulp.task('watch', function() {
    gulp.watch(['src/scss/*.scss'], ['sass']);
    gulp.watch(['src/**/*.js'], ['copy', 'jshint']);
    gulp.watch([config.appFiles.templates], ['html2js']);
    gulp.watch('src/index.html', ['index']);
});

/**
 * Setup our default task, when `gulp` is run.
 */
gulp.task('default', function() {
    runSequence('build', 'watch', 'server', 'livereload');
});

gulp.task('build', function() {
    runSequence('clean', 'sass', 'html2js', 'copy', 'index');
});
