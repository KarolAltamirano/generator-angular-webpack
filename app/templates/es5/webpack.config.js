'use strict';

module.exports = {
    entry: './src/scripts/main.js',
    module: {
        loaders: [
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'ng-annotate' },
            { test: /\.json$/, loader: 'json' }
        ]
    }
};
