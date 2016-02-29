'use strict';

module.exports = {
    entry: './src/scripts/main.js',
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
            { test: /\.js$/, exclude: /node_modules/, loader: 'ng-annotate!babel' }<% } else { %>
            { test: /\.js$/, exclude: /node_modules/, loader: 'ng-annotate' }<% } %>,
            { test: /\.json$/, loader: 'json' },
            { test: /.*gsap.*/, loader: 'imports?gs=>window.GreenSockGlobals={}!exports?gs' },
            { test: /.*PreloadJS.*/, loader: 'imports?this=>global!exports?window.createjs' }<% if (soundjs) { %>,
            { test: /.*SoundJS.*/, loader: 'imports?this=>global!exports?window.createjs' }<% } %><% if (easeljs) { %>,
            { test: /.*EaselJS.*/, loader: 'imports?this=>global!exports?window.createjs' }<% } %>
        ]
    }
};
