var webpack = require('webpack');
var path = require('path');
var Dotenv = require('dotenv-webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	/* entry부터 시작하여 다른 의존 파일들을 재귀적으로 호출 */
	entry: [
        'babel-polyfill',
		'./src/index.js'
	],

	/* 불러모은 자바스크립트 파일들을 bundle.js로 합쳐서 저장 */
	output: {
		path: path.resolve(__dirname, '../public'),
		filename: 'ahribori.js'
	},

	module: {
		loaders: [
			{
				test: /\.js|jsx$/,
				loaders: ['react-hot', 'babel?' + JSON.stringify({
					cacheDirectory: true,
					plugins: ["transform-class-properties", "transform-object-rest-spread"],
					presets: ['latest', 'react']
				})],
				exclude: /node_modules/
			},
			{
				test: /\.(css|scss)$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
        new Dotenv({
            path: './.env',
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.DedupePlugin(),
        // new BundleAnalyzerPlugin({
        //     analyzerHost: '127.0.0.1',
        //     analyzerPort: 51234,
        //     openAnalyzer: false,
        // })
	]

};