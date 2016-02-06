# Root folders
```
src     : source code
test    : unit and e2e test scripts
website : builded page (do not edit files there)
```

# 'src' folder
```
assets  : don't place assets here. Add assets to /website/assets/ folder.
data    : json files preloaded with preloadjs
scripts : app       - angular app
          data      - json files required with webpack
          utilities - utilities scripts
          header.js - app file loaded in header
          main.js   - main app file
scss    : assets    - scss styles preloaded with preloadjs
                        (for inline images), edit _assets.scss, use just
                        for a small icons, no big images
          modules   - scss modules
          _base     - default styling
          _fonts    - page fonts
          _shared   - scss variables and mixins shared in all scss files
          style     - main style file
tpls    : html templates
```

# 'website' folder
```
assets : media files (images, sprites, video, audio ...)
```

# Gulp tasks
```
gulp build        : build for development
gulp watch        : watch for changes and rebuild updated file
gulp              : default task runs 'gulp watch'
gulp build --dist : build for production
gulp connect      : create http server for testing production version
gulp bump --major : bump major version
gulp bump --minor : bump minor version
gulp bump --patch : bump patch version
```

# Config file 'config.json'
```
jsLibHeader : Order of JavaScript libraries loaded in header               
root        : List of RootFiles to copy to website folder
```

# Build version
```
To hide build version info set `renderVersionInfo` to `false` inside `src/scripts/utilities/appSettings.js` file.
To bump version use gulp task `gulp bump --major | --minor | --patch`
```

# Test
## Getting started
```
run "npm install" inside "test" directory
run unit tests with karma or e2e tests with protractor
```

# Linting
## JavaScript
.eslintrc

## SCSS
.scss-lint.yml

## HTML
.htmlhintrc

# SCSS
## Bourbon

## Neat

## Assets mixins
```
@include retina-inline-asset($name, $ext: "png")

Mixin for generating stile with background image encoded in base64 for non-retina and retina screens.
Use this mixin only in `/src/scss/assets/_assets.scss` and only for small icons and logos.
```

```
@include retina-asset($name, $ext: "png")

Mixin for generating stile with background image for non-retina and retina screens.
Use this mixin only in `/src/scss/modules/*.scss`
```

## CSS assets for bower packages
css file from bower package will be built automatically but assets have to be
copied manually into `/website/css/vendor/`
