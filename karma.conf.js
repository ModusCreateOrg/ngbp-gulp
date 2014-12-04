module.exports = function(config) {
    config.set({
        singleRun: false,
        frameworks: ['jasmine'],
        plugins: ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage'],
        files: [
            'vendor/angular/angular.js',
            'vendor/angular-mocks/angular-mocks.js',
            'vendor/angular-aria/angular-aria.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/hammerjs/hammer.js',
            'vendor/angular-material/angular-material.js',
            'src/**/*.js',
            'src/**/*.spec.js'
        ],
        exclude: [
            'src/assets/**/*.js'
        ],
        browsers: [
            'PhantomJS'
        ],
        reporters: ['dots', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }
    });
};