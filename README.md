Angular Boilerplate
======
A version of the NGBP that uses gulp instead of Grunt, and comes default with the Angular Material library. Basic code exampples are setup to follow [Todd Motto](https://github.com/toddmotto/angularjs-styleguide) and [John Papa's](https://github.com/johnpapa/angularjs-styleguide) styleguide for Angular. Inspired by [ngbp](https://github.com/ngbp/ngbp) by [Josh Miller](https://github.com/joshdmiller).

### Get up and running
To use this boilerplate, we'll assume that you have globally installed versions of `bower` and `npm`, as well as `node`.

Download a ZIP of this repository - or clone, and run:

```shell
$ npm install
$ bower install
$ gulp
```

A server will be started at `localhost:1337` for local dev. gulp will watch for changes to your filesystem, and run the appropriate tasks based on what changes.

### Addtional vendor files
New application files that are added to `/src` will automatically be added to the build. Vendor JS and CSS paths must be added to `build.config.js`, as well as `karma.conf.js`.

### Going to production
Ready to go to prod? Bump the version number in `package.json`, and run `gulp prod` to do a build. Production ready assets and code will be copied over to your `/dist` directory and ready for deployment.

### Livereload
For livereaload to work, you must [install this Chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) and have it activated when developing on `localhost:1337`. 

### Available Tasks
All tasks can be seen in the shell by running `gulp help`

```
build             runs: clean, sass, html2js, copy, test, index
build-prod-css    builds production ready CSS from /build
build-prod-index  builds our index.html file for production
build-prod-js     builds production ready javascript versionf of vendor, 
                  application, and template javascript.

clean             cleaning build directories
copy              copies all relevant files to their proper location in /build during development
help              Display this help text.
html2js           compiles .tpl.html files into javascript templates, injected into $templateCache
index             injects script and css files into our index.html file
jshint            runs jshint on our application code. reads a local copy of your .jshintrc 
                  in the root of the project
livereload        don't run this manually
ngAnnotate        runs ngAnnotate on our code for proper `strictdi` conformity
prod              builds our app for production, in /dist
sass              compiles sass files into css
server            spins up a local development server on 0.0.0.0:1337
test              uses karma to directly run our unit tests
watch             
```

### Contributing
Please! I'd love to hear bug reports as well as pull requests.
![yes](http://memesly.com/media/created/204trf.jpg)

### License
```
   DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004

Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
 ```
