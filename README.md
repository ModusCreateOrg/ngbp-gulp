Modus Angular Boilerplate
======
A version of the Modus NGBP that uses gulp instead of Grunt. Setup to follow Todd Motto and John Papa's styleguide for Angular. Inspired by [ngbp](https://github.com/ngbp/ngbp) by [Josh Miller](https://github.com/joshdmiller).

### Get up and running
To use this boilerplate, we'll assume that you have globally installed `bower` and `npm`, as well as `node`.

Download a ZIP of this repository - or clone, and run:

```shell
$ npm install
$ bower install
$ gulp
```

A server will be started at `localhost:1337` for local dev. gulp will watch for changes to your filesystem, and run the appropriate tasks based on what changes.

### Livereload
For livereaload to work, you must [install this Chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) and have it activated when developing on `localhost:1337. 

### Available Tasks
All tasks can be seen in the shell by running `gulp help`

```
build       runs -> clean, sass, html2js, copy, test, index
clean       cleaning build directories
copy        copies all relevant files to their proper location
default     runs -> build, watch, server, livereload
help        Display this help text.
html2js     compiles .tpl.html files into javascript templates, injected into $templateCache
index       injects script and css files into our index.html file
jshint      runs jshint on our application code. reads a local copy of your .jshintrc in the root of the project
livereload  
sass        compiles sass files into css
server      spins up a local development server on 0.0.0.0:1337
test        uses karma to directly run our unit tests
watch      
```

### TODO
- [ ] understanding if I'm using gulp properly
