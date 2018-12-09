const path = require('path');
const webpack = require("webpack");
const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist')
};

var options = {
    entry: {
        'rse': [path.join(__dirname, 'src', 'index.ts')]
    },
    watch: false,
    output: {
        path: PATHS.build,
        filename: '[name].min.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [],
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    }
};

switch (process.env.NODE_ENV) {
    case "production":
        options['plugins'].push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                passes: 5
            },
            mangle: {
                props: { regex: new RegExp(/^_|Promise/) }
            }
        }));
        break;
}

module.exports = options;