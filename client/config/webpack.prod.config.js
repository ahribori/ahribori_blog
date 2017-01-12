var webpack = require('webpack');
var path = require('path');

module.exports = {
	/* entry부터 시작하여 다른 의존 파일들을 재귀적으로 호출 */
	entry: [
		'./src/index.js',
		'./src/style.scss'
	],

	/* 불러모은 자바스크립트 파일들을 bundle.js로 합쳐서 저장 */
	output: {
		path: path.resolve(__dirname, '../public'),
		filename: 'bundle.js'
	},

	resolve: {
		root: path.resolve('./src')
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['react-hot', 'babel?' + JSON.stringify({
					cacheDirectory: true,
					presets: ['latest', 'react']
				})],
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
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
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]

};