let webpack = require('webpack');
let path = require('path');
let WebpackCleanupPlugin = require('webpack-cleanup-plugin');
let WebpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

module.exports = {
    context: __dirname,
    entry: {
        app: './src/index.js'
    },
    cache: true,
    devtool: 'eval-source-map',
    output: {
        path: __dirname + '/js',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loaders: ['html-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ['babel-loader']
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new WebpackUglifyJsPlugin({
            cacheFolder: path.resolve(__dirname, './cached_uglify/'),
            debug: true,
            minimize: true,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        })
    ]
};
