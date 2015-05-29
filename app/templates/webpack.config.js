module.exports = {
    entry: './src/scripts/main.js',
    output: {
        filename: 'main.js',
        sourceMapFilename: 'maps/[file].map'
    },
    module: {
        loaders: [
            { test: /\.js$/,   loader: 'ng-annotate' },
            { test: /\.json$/, loader: 'json'        }
        ]
    }
};
