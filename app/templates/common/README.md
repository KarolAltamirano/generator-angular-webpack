# ROOT FOLDERS
    src       : source code
    test      : unit and e2e test scripts
    website   : builded page (do not edit files there)

# SRC FOLDER
    assets    : don't place assets here. Add assets to /website/assets/ folder.
    data      : json files preloaded with preloadjs
    scripts   : app       - angular app
                data      - json files required with webpack
                globals   - global application scripts and helper functions
                utilities - utilities scripts
                main.js   - main app file
    scss      : assets    - scss styles preloaded with preloadjs
                            (for inline images), edit _assets.scss, use just
                            for a small icons, not big images
                modules   - scss modules
                _base     - default styling
                _fonts    - page fonts
                _shared   - scss variables and mixins shared in all scss files
                style     - main style file
    tpls      : html templates

# WEBSITE FOLDER
    assets    : media files (images, sprites, video, audio ...)

# GULP TASKS
    gulp build         : build for development
    gulp watch         : watch for changes and rebuild updated file
    gulp               : default task runs 'gulp watch'
    gulp build --dist  : build for production
    gulp connect       : create http server for testing production version
    gulp bump --major - bump major version
    gulp bump --minor - bump minor version
    gulp bump --patch - bump patch version

# CONFIG FILE config.json
    jsHeader : Order of JavaScript files loaded in header
               (if using ES2015 version of SCAFFOLD, write these files in ES5)
    css      : Main SCSS files
    root     : List of RootFiles to copy to website folder

# BUILD VERSION ELEMENT
To hide build version info set `app.renderVersionInfo` to `false` inside `src/scripts/globals/appSettings.js` file.
To bump version use gulp task `gulp bump --major | --minor | --patch`

# TEST
## Getting started
    run "npm install" inside "test" directory
    run unit tests with karma or e2e tests with protractor

# SASS mixins
#### @include breakpoint()
helper mixin for creating media queries. Example in /src/scss/modules/_layout.scss
Documentation: [Click here](https://github.com/at-import/breakpoint/wiki)
Example:

    @include breakpoint($tablet) {
        font-size: 1.5em;
    }

    @include breakpoint($desktop) {
        font-size: 1.7em;
    }

#### @include retina-inline-asset($name, $ext: "png")
mixin for generating stile with background image encoded in base64 for non-retina and retina screens.
Use this mixin only in /src/scss/assets/_assets.scss and only for small icons and logos.

#### @include retina-asset($name, $ext: "png")
mixin for generating stile with background image for non-retina and retina screens.
Use this mixin only in /src/scss/modules/*.scss

# CSS assets for bower packages
css file from bower package will be builded automatically but assets have to be
copied manually into /website/css/vendor/
