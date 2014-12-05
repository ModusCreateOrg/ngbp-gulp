var gulp = require('gulp-help')(require('gulp'));

var bytediff = require('gulp-bytediff');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var del = require('del');
var ecstatic = require("ecstatic");
var gutil = require('gulp-util');
var http = require('http');
var inject = require("gulp-inject");
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var livereload = require('gulp-livereload');
var merge = require('merge-stream');
var minifyHtml = require("gulp-minify-html");
var ngAnnotate = require('gulp-ng-annotate');
var ngHtml2Js = require("gulp-ng-html2js");
var plumber = require('gulp-plumber');
var Q = require("q");
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var stylish = require('jshint-stylish');
var uglify = require("gulp-uglify");
var watch = require('gulp-watch');
var wrap = require("gulp-wrap");

// require package.json and our build configuration.
var pkg = require('./package.json');
var config = require('./build.config.js');


// once all of our files are "built", we can now get them ready for production.
var prodFileName = pkg.name + '-' + pkg.version;

var prodOutputFiles = {
    js: prodFileName + '.min.js',
    css: prodFileName + '.css'
};


/**
 * Compiles our SCSS, renames it to match our package.json file, and moves it into our build directory.
 */
gulp.task('sass', 'compiles sass files into css', function() {
    return gulp.src(config.appFiles.scss)
        .pipe(plumber())
        .pipe(sass())
        .pipe(rename({
            basename: pkg.name + '-' + pkg.version
        }))
        .pipe(gulp.dest(config.buildDir + '/assets'));
});

/**
 * Cleans our /build and /dist folders before we start our build.
 */
gulp.task('clean', 'cleaning build directories', function() {
    return del([config.buildDir, config.prodDir]);
});

/**
 * Does the appropriate copying of our files into the proper
 * build directories. Only copy the changes files.
 */
gulp.task('copy', 'copies all relevant files to their proper location in /build during development', function() {

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
gulp.task('index', 'injects script and css files into our index.html file', function() {
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
 * Run test once and exit
 */
gulp.task('test', 'uses karma to directly run our unit tests', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});


/**
 * Once our code is copied into /build, go through and annotate it.
 */
gulp.task('ngAnnotate', 'runs ngAnnotate on our code for proper `strictdi` conformity', function() {
    return gulp.src(config.buildDir + '/src/**/*.js')
        .pipe(plumber())
        .pipe(ngAnnotate({ add: true }))
        .pipe(gulp.dest(config.buildDir + '/src'));
});

/**
 * Compiles all of our application templates (*.tpl.html) into angular modules
 * using $templateCache
 */
gulp.task('html2js', 'compiles .tpl.html files into javascript templates, injected into $templateCache', function() {
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
        .pipe(uglify())
        .pipe(gulp.dest(config.buildDir));
});


/**
 * Setup livereload to watch our build directory for changes, and reload.
 */
gulp.task('livereload', 'don\'t run this manually', function() {
    livereload.listen();
    gulp.watch(config.buildDir + '/**').on('change', livereload.changed);
});


/**
 * Spin up a really simple node server to do development on.
 */
gulp.task('server', 'spins up a local development server on 0.0.0.0:1337', function() {
    http.createServer(ecstatic({root: __dirname + '/build'})).listen(1337);
    gutil.log(gutil.colors.blue('HTTP server listening on port 1337'));
});

/**
 * Runs jsHint on all of our application javascript and runs
 * it through a pretty reporter.
 */
 gulp.task('jshint', 'runs jshint on our application code. reads a local copy of your .jshintrc in the root of the project', function() {
     return gulp.src(config.appFiles.js)
         .pipe(jshint())
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
 * does all of our production things.
 */
gulp.task('build-prod-js', 'builds production ready javascript versionf of vendor, application, and template javascript.', function() {

    // concat all of our vendor js and app js files.
    var files = [].concat(config.vendorFiles.js, config.appFiles.js, config.buildDir + '/templates-app.js');
    return gulp.src(files)
        .pipe(plumber())
        .pipe(concat(prodOutputFiles.js, {
            newLine: ';'
        }))
        .pipe(ngAnnotate())
        .pipe(bytediff.start())
        .pipe(uglify({
            mangle: true
        }))
        .pipe(bytediff.stop())
        .pipe(gulp.dest(config.prodDir + '/assets'));

});

gulp.task('build-prod-css', 'builds production ready CSS from /build', function() {
    var files = [].concat(config.buildDir + '/vendor/**/*.css', config.buildDir + '/assets/*.css');
    console.log(files);
    return gulp.src(files)
        .pipe(plumber())
        .pipe(concat(prodOutputFiles.css))
        .pipe(bytediff.start())
        .pipe(csso())
        .pipe(bytediff.stop())
        .pipe(gulp.dest(config.prodDir + '/assets'));
});


gulp.task('build-prod-index', 'builds our index.html file for production', function() {

    // copy over our templates
    var indexFile = gulp.src('src/index.html');
    var files = [].concat(
       'assets/' + prodOutputFiles.css,
       'assets/' + prodOutputFiles.js
    );

    var sources = gulp.src(files, {
        read: false,
        cwd: config.prodDir,
    });

    // inject the files, and copy it to the build directory
    return indexFile.pipe(inject(sources, { addRootSlash: false }))
        .pipe(gulp.dest(config.prodDir));


});

/**
 * Setup our default task, when `gulp` is run.
 */
gulp.task('default', 'runs -> build, watch, server, livereload', function() {
    runSequence('build', ['watch', 'server'], 'livereload');
});

gulp.task('build', 'runs -> clean, sass, html2js, copy, test, index', function() {
    runSequence('clean', 'sass', 'html2js', 'copy', 'ngAnnotate', 'test', 'index');
});

/**
 * Setup our prod task
 */
 gulp.task('prod', 'builds our app for production, in /dist', function(callback) {
     runSequence('clean', 'sass', 'html2js', 'copy', 'test', 'build-prod-js', 'build-prod-css', 'build-prod-index', callback);
 });


