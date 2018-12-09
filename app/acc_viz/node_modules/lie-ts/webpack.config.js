const path = require('path');
const webpack = require("webpack");
const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist')
};

var options = {
    entry: {
        'lie-ts': [path.join(__dirname, 'src', 'index.ts')]
    },
    watch: false,
    output: {
        path: PATHS.build,
        filename: '[name].min.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    node: {
        setImmediate: false,
        Promise: false,
        process: false,
        global: false
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    externals: [],
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
                props: { regex: new RegExp(/^_/) }
            }
        }));
        break;
}

module.exports = options;