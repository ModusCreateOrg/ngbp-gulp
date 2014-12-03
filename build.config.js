/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    buildDir: 'build',
    prodDir: 'dist',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    appFiles: {
        js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
        jsunit: ['src/**/*.spec.js'],

        templates: ['src/app/**/*.tpl.html'],

        html: ['src/index.html'],

        scss: 'src/scss/*.scss'
    },

    /**
     * This is a collection of files used during testing only.
     */

    testFiles: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    /**
     * This is the same as `appFiles`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */

    vendorFiles: {
        js: [
            'vendor/angular/angular.js',
            'vendor/angular-aria/angular-aria.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/hammerjs/hammer.js',
            'vendor/angular-material/angular-material.js'
        ],
        css: [
          'vendor/angular-material/angular-material.min.css',
          'vendor/angular-material/themes/blue-theme.css',
          'vendor/angular-material/themes/grey-theme.css'
        ]
    }
};
