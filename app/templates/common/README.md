# Angular with Webpack
Project was generated with Yeoman generator
[generator-angular-webpack](https://www.npmjs.com/package/generator-angular-webpack)

# Requirements
- NodeJS v4.0 or newer
- npm v3.3 or newer
- gulp (read [Getting Started guide](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md))

# Install all npm dependencies for development
- Skip this step if you have generated the project with Yeoman. Yeoman install all dependencies for you.
- To install all development dependencies of existing project run `npm install` inside the root
  directory of the project.

# Root folders
```
src     : source code
test    : unit and e2e test scripts
website : built page (do not edit files there)
```

# 'src' folder
```
assets  : don't place assets here. Add assets to /website/assets/ folder.
data    : json files preloaded with preloadjs
scripts : app       - angular app
          data      - json files required with webpack
          utilities - app classes and objects
          main.js   - main app file
scss    : assets    - styles preloaded with preloadjs (for inline images)
                      edit _assets.scss
                      use just for a small icons (no big images)
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
gulp browser-sync : create http server for testing
gulp data         : build json data from 'src/data/' directory
gulp bump --major : bump major version
gulp bump --minor : bump minor version
gulp bump --patch : bump patch version
```

# Webpack
## Installing JavaScript libraries
- Install libraries with npm.

## Installing JavaScript libraries with broken module style
- If new installed library doesn't work properly with webpack read more about shimming modules
  [here](http://webpack.github.io/docs/shimming-modules.html).

## Installing JavaScript libraries not published in npm
- If you want to install library not published in npm but with `package.json` inside git repository
  you can install package from git repository. Read [here](https://docs.npmjs.com/cli/install) how to
  install it.
- If you want to install library not published in npm and without `package.json` you can install it
  from git repository with [`napa`](https://github.com/shama/napa).
- To install new library add it to `package.json` file to `napa` variable and run `npm install`.
  More details how to use `napa` can be found [here](https://github.com/shama/napa).
- Probably you will need to set `resolve.alias` and `loaders` inside `webpack.config.js` for
  libraries not published in npm.

# Modernizr configuration
- To configure modernizr change its settings inside `modernizr-config.json`.
- List of all available settings:
  [show](https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json)

# CSS compatibility configuration
- To set autoprefixer for CSS set `AUTO_PREFIXER_RULES` variable inside `gulpfile.js`.
- Default value: `['last 2 versions']`.
- List of available values: [show](https://github.com/ai/browserslist#queries)

# Config file 'config.json'
```        
root             : List of files to copy to website root folder
scssIncludePaths : Array of sass libraries
cssVendor        : Array of css libraries installed with npm
```

# Build version
To hide build version info set `renderVersionInfo` to `false` inside `src/scripts/utilities/appSettings.js` file.
To bump version use gulp task `gulp bump --major | --minor | --patch`

# Test
Run unit tests with `karma start` or e2e tests with `protractor`
- Karma homepage: [show](https://karma-runner.github.io/0.13/index.html)
- Protractor homepage: [show](https://angular.github.io/protractor/#/)

# Linting
Use linter in your text editor for JavaScript, SCSS and HTML.

## JavaScript
- For JavaScript use [ESLint](http://eslint.org/). The project contains ESLint configuration
  file `.eslintrc`
- Use ESLint version 2.x.x
- ESLint for Atom - [show](https://github.com/AtomLinter/linter-eslint)
- ESLint for Sublime Text - [show](https://github.com/roadhump/SublimeLinter-eslint)

## SCSS
- For SCSS use [SCSS-Lint](https://github.com/brigade/scss-lint). The project contains SCSS-Lint
  configuration file `.scss-lint.yml`
- SCSS-Lint for Atom - [show](https://github.com/AtomLinter/linter-scss-lint)
- SCSS-Lint for Sublime Text - [show](https://github.com/attenzione/SublimeLinter-scss-lint)

## HTML
- For HTML use [HTMLHint](https://github.com/yaniswang/HTMLHint). The project contains HTMLHint
  configuration file `.htmlhintrc`
- HTMLHint for Atom - [show](https://github.com/AtomLinter/linter-htmlhint)
- HTMLHint for Sublime Text - [show](https://github.com/mmaday/SublimeLinter-contrib-htmlhint)

# SCSS
## Bourbon
Mixin library for Sass. Check Bourbon [homepage](http://bourbon.io/) for more details and documentation.
**Do not use Bourbon mixins for Vendor Prefixes!** SCSS build uses `autoprefixer` for them.

Examples:
```
HiDPI Media Query:

    @include hidpi(1.5) {
        width: 20em;
    }

Font Face:

    @include font-face('generica', '../assets/fonts/generica', $file-formats: eot woff ttf svg);

Retina Image:

    @retina-image($filename, $background-size, $extension*, $retina-filename*, $retina-suffix*, $asset-pipeline*)

    Argument Defaults:
        $extension: png
        $retina-filename: null
        $retina-suffix: _2x
        $asset-pipeline: false
```

## Neat
Grid framework for Sass and Bourbon. Check Neat [homepage](http://neat.bourbon.io/) for
more details and documentation.

Examples: [here](http://neat.bourbon.io/examples/)

## Assets mixin
```
@include retina-inline-asset($name, $ext: 'png')

Mixin for generating css with background image encoded in base64 for non-retina and retina screens.
Use this mixin only in `/src/scss/assets/_assets.scss` and only for small icons and logos.
```
