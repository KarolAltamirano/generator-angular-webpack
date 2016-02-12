'use strict';

module.exports = {
    entry: {
        header: './src/scripts/header.js',
        main: './src/scripts/main.js',
        vendorheader: [
            'ua-parser-js'<% if (es2015) { %>,
            'babel-polyfill'<% } %>
        ],
        vendor: [
            'angular',
            'angular-animate',
            'angular-mocks',
            'angular-resource',
            'angular-sanitize',
            'angular-touch',
            'angular-ui-router'<% if (datgui) { %>,
            'dat-gui'<% } %>,
            'debug',
            'gsap',
            'ismobilejs',
            'jquery'<% if (pixijs) { %>,
            'pixi.js'<% } %><% if (statsjs) { %>,
            'stats.js'<% } %>,
            'ua-parser-js',
            'createjs'<% if (soundjs) { %>,
            'SoundJS'<% } %><% if (easeljs) { %>,
            'EaselJS'<% } %>
        ]
    },
    resolve: {
        alias: {
            createjs: 'PreloadJS/lib/preloadjs-0.6.2.combined.js'<% if (soundjs) { %>,
            SoundJS: 'SoundJS/lib/soundjs-0.6.2.combined.js'<% } %><% if (easeljs) { %>,
            EaselJS: 'EaselJS/lib/easeljs-0.8.2.combined.js'<% } %>
        }
    }<% if (pixijs) { %>,
    node: {
        fs: 'empty'
    }<% } %>,
    module: {
        loaders: [<% if (es2015) { %>
            { test: /\.js$/, exclude: /(node_modules)/, loader: 'ng-annotate!babel?presets[]=es2015' }<% } else { %>
            { test: /\.js$/, exclude: /(node_modules)/, loader: 'ng-annotate' }<% } %>,
            { test: /\.json$/, loader: 'json' },
            { test: /.*gsap.*/, loader: 'imports?gs=>window.GreenSockGlobals={}!exports?gs' },
            { test: /.*PreloadJS.*/, loader: 'imports?this=>global!exports?window.createjs' }<% if (soundjs) { %>,
            { test: /.*SoundJS.*/, loader: 'imports?this=>global!exports?window.createjs' }<% } %><% if (easeljs) { %>,
            { test: /.*EaselJS.*/, loader: 'imports?this=>global!exports?window.createjs' }<% } %>
        ]
    }
};
