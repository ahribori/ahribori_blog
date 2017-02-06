/* =========================================
 Load dependencies
 ============================================*/
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
/* =========================================
 Load Config.js
 ============================================*/
const port = process.env.PORT || 8088;
const devServerPort = 4000;

/* =========================================
 Express Configuration
 ============================================*/
const app = express();


/* 1. public을 static 경로로 설정 */
app.use('/', express.static(path.join(__dirname, './../public')));

/*
 2. 모든 요청에 대하여 index.html을 response 해준다. (SPA)
 반드시 1.보다 아래에 위치하여야 함.
 */
app.get('*', function (req, res) {
	res.sendFile(path.resolve(__dirname, './../public/index.html'));
});


// open the server
app.listen(port, () => {
	console.log(`Express is running on port => ${port}`)
});

/*
 develop 환경일 때 webpack-dev-server를 켜는 코드
 */
if (process.env.NODE_ENV === 'development') {
	console.log('Server is running on development mode');
	const config = require('../config/webpack.dev.config');
	const compiler = webpack(config);
	const devServer = new WebpackDevServer(compiler, config.devServer);
	devServer.listen(
		devServerPort, () => {
			console.log('webpack-dev-server is listing on port', devServerPort);
		}
	)
}