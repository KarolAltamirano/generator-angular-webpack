'use strict';

module.exports = {
    entry: './src/scripts/main.js',
    module: {
        loaders: [
            { test: /\.js$/,   loader: 'ng-annotate!babel?presets[]=es2015' },
            { test: /\.json$/, loader: 'json' }
        ]
    }
};
