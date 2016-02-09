# Angular Webpack generator
## ES2015 (Babel) or ES5

[![Build Status](https://travis-ci.org/KarolAltamirano/generator-angular-webpack.svg?branch=master)](https://travis-ci.org/KarolAltamirano/generator-angular-webpack)
[![Dependency Status](https://david-dm.org/KarolAltamirano/generator-angular-webpack.svg)](https://david-dm.org/KarolAltamirano/generator-angular-webpack)
[![GitHub version](https://badge.fury.io/gh/KarolAltamirano%2Fgenerator-angular-webpack.svg)](https://badge.fury.io/gh/KarolAltamirano%2Fgenerator-angular-webpack)
[![npm version](https://badge.fury.io/js/generator-angular-webpack.svg)](https://badge.fury.io/js/generator-angular-webpack)

## Getting Started
### Requirements
- NodeJS v4.0 or newer
- npm v3.3 or newer
- yo (to install run `npm install -g yo`)
- bower (to install run `npm install -g bower`)
- gulp (read [Getting Started guide](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md))

### Installation
- Install: `npm install -g generator-angular-webpack`
- Run: `yo angular-webpack`
- Run: `gulp` to build for development and watch for file changes or `gulp build --dist` to build for production

## More details can be found inside readme file of generated project.
[Click here](https://github.com/KarolAltamirano/generator-angular-webpack/blob/master/app/templates/common/README.md) to see the readme file.

## Release History
* 2016-02-09 v0.4.2 Changes in html and scss linter configuration files, changed build notifications logic,
  removed retina-asset mixin in favor of Bourbon retina-image mixin, renamed retina template images
  for consistency with Bourbon
* 2016-02-08 v0.4.1 Fix readme file
* 2016-02-08 v0.4.0 JavaScript in header is built with Webpack, SCSS is built with libSass and PostCSS,
  Added SCSS-Lint and HTMLHint configuration files, Added SCSS libraries Bourbon and Neat,
  Added normalize.css, Updated all dependencies to newest versions
* 2016-01-12 v0.3.1 Fix readme
* 2016-01-12 v0.3.0 Add ES2015 (Babel)
* 2016-01-07 v0.2.5 Add build version info
* 2016-01-07 v0.2.4 Added ESLint, updated build process, update to newest npm packages
* 2015-09-04 v0.2.3 Added pixi.js, fix watching index.html file
* 2015-07-29 v0.2.2 Fix: incompatible browser detection, support of old browsers
* 2015-07-29 v0.2.1 Fix: remove inline font from css
* 2015-07-29 v0.2.0 New minor version - many improvements and changes
* 2015-06-02 v0.1.3 Fix gulp clean task
* 2015-06-01 v0.1.2 Add possibility to choose optional libraries
* 2015-05-29 v0.1.1 Fix bug with generating gitingone file
* 2015-05-29 v0.1.0 Initial release
