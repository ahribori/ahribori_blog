const webpack = require('webpack');
const config = require('./path.config');

require('dotenv').load();

const SERVER_PORT = process.env.PORT || 3000;
const FULL_SERVER_URL = process.env.FULL_SERVER_URL || 'http://localhost:' + SERVER_PORT;

module.exports = {
    context: config.context,
    entry: {
        sdk: [
            'babel-polyfill',
            config.sdkIndexJs
        ],
        ahribori: config.appIndexJs,
    },
    output: {
        filename: '[name].js',
        path: config.appBuild
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['react-app'] }
                }],
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
            'process.env.SERVER_URL': `"${FULL_SERVER_URL}"`
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            },
            exclude: [/\.min\.js$/gi]
        })
    ],
    resolve: {
        modules: [
            config.context,
            'node_modules'
        ]
    }
};
