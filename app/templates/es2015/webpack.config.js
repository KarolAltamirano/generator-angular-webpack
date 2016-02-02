'use strict';

module.exports = {
    entry: {
        header: './src/scripts/header.js',
        main: './src/scripts/main.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'ng-annotate!babel?presets[]=es2015' },
            { test: /\.json$/, loader: 'json' }
        ]
    }
};
