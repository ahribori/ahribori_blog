const webpack = require('webpack');
const config = require('./path.config');

require('dotenv').load();

const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT || 4000;
const FULL_SERVER_URL = process.env.FULL_SERVER_URL || 'http://localhost:' + DEV_SERVER_PORT;

module.exports = {
    entry: {
        sdk: [
            'babel-polyfill',
            config.sdkIndexJs
        ],
        ahribori: [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://0.0.0.0:${DEV_SERVER_PORT}`,
            'webpack/hot/only-dev-server',
            config.appIndexJs
        ],
    },
    output: {
        filename: '[name].js',
        path: config.appBuild,
        publicPath: '/'
    },
    context: config.context,
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env', {
                                    modules: false,
                                }],
                                'react',
                            ],
                            plugins: [
                                ['transform-object-rest-spread', { useBuiltIns: true }],
                                // (remember, always put this at the last)
                                'react-hot-loader/babel',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"',
            'process.env.SERVER_URL': `"${FULL_SERVER_URL}"`
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        modules: [
            config.context,
            'node_modules',
        ],
    },
    devServer: {
        proxy: { // proxy URLs to backend development server
            '/': 'http://localhost:' + (process.env.PORT || 3000),
        },
        contentBase: config.public,
        port: DEV_SERVER_PORT,
        hot: true,
        inline: false,
        noInfo: true,
        historyApiFallback: true,
    },
};

