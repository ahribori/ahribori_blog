var webpack = require('webpack');
var path = require('path');
var Dotenv = require('dotenv-webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {

	/* webpack-dev-server를 콘솔이 아닌 자바스크립트로 실행 할 땐,
	 HotReloadingModule 를 사용하기 위해선 dev-server 클라이언트와
	 핫 모듈을 따로 entry 에 넣어주어야 합니다. */

	entry: [
		'babel-polyfill',
		'./src/index.js',
		'webpack-dev-server/client?http://0.0.0.0:4000', // 개발서버의 포트가 이 부분에 입력되어야 제대로 작동합니다
		'webpack/hot/only-dev-server'
	],

	output: {
		path: '/', // public 이 아니고 /, 이렇게 하면 파일을 메모리에 저장하고 사용합니다
		filename: 'ahribori.js'
	},

	// 개발서버 설정입니다
	devServer: {
		hot: true,
		inline: true,
		host: '0.0.0.0',
		port: 4000,
		historyApiFallback: true,
		contentBase: path.resolve(__dirname, '../public'),
		/* 모든 요청을 프록시로 돌려서 express의 응답을 받아오며,
		 bundle 파일의 경우엔 우선권을 가져서 devserver 의 스크립트를 사용하게 됩니다 */
		// proxy: {
		// 	"**": "http://localhost:3000" // express 서버주소
		// },
		stats: {
			// 콘솔 로그를 최소화 합니다
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	},

	devtool: 'eval-source-map',

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env':{
				'NODE_ENV': JSON.stringify('development')
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
        // new BundleAnalyzerPlugin({
        //     analyzerHost: '127.0.0.1',
        //     analyzerPort: 51234,
        //     openAnalyzer: false,
        // })
	],

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
	}
};