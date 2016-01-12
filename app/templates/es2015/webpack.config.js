'use strict';

module.exports = {
    entry: './src/scripts/main.js',
    module: {
        loaders: [
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'ng-annotate!babel?presets[]=es2015' },
            { test: /\.json$/, loader: 'json' }
        ]
    }
};
