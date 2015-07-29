module.exports = {
    entry: './src/scripts/main.js',
    module: {
        loaders: [
            { test: /\.js$/,   loader: 'ng-annotate' },
            { test: /\.json$/, loader: 'json'        }
        ]
    }
};
