/* =========================================
 Load dependencies
 ============================================*/
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import fs from 'fs';

/* =========================================
 Load server side rendering dependencies
 ============================================*/
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import routes from './routes';
import reducers from './reducers';
const middlewares = [thunk];
const store = compose(applyMiddleware(...middlewares))(createStore)(reducers);

import 'jsdom';
require('jsdom-global')();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/* =========================================
 Load Config.js
 ============================================*/
const port = process.env.PORT || 8088;
const devServerPort = 4000;

/* =========================================
 Express Configuration
 ============================================*/
const app = express();

/* =========================================
 Fetch data & Server-side rendering
 ============================================*/
const getReduxPromise = (props) => {
    let { query, params } = props;
    let comp = props.components[props.components.length - 1].WrappedComponent;
    let promise = comp.fetchDataServerSide ?
        comp.fetchDataServerSide({ store, params, history }) :
        Promise.resolve();
    return promise;
};

const renderFullPage = (html, reduxState, res) => {
    fs.readFile(path.resolve(__dirname, './../public/index.html'), 'utf-8', (err, file) => {
        if (err) throw err;
        res.send(file.replace(`<div id="app"></div>`,
            `<div id="app">${html}</div>
			 <script>window.__REDUX_STATE__ = ${reduxState}</script>`
        ));
    });
};

app.use('/',(req,res,next) => {
	if (req.url === '/') {
        match({ routes: routes, location: req.url }, (err, redirect, props) => {
			getReduxPromise(props).then(() => {
				const appHtml = renderToString(
					<MuiThemeProvider>
						<Provider store={store}>
							<RouterContext {...props}/>
						</Provider>
					</MuiThemeProvider>
				);
                let reduxState = store.getState();
                try {
                    reduxState = JSON.stringify(reduxState).replace(/</g, '\\u003c');
                } catch (e) {
                    reduxState = {};
                }
				renderFullPage(appHtml, reduxState, res);
			});
        });
	} else {
		next();
	}
});

/* 1. public을 static 경로로 설정 */
app.use('/', express.static(path.join(__dirname, './../public')));

app.get('*', function (req, res) {
    if (process.env.NODE_ENV === 'production') {
        match({ routes: routes, location: req.url }, (err, redirect, props) => {
            getReduxPromise(props).then(() => {
                const appHtml = renderToString(
					<MuiThemeProvider>
						<Provider store={store}>
							<RouterContext {...props} />
						</Provider>
					</MuiThemeProvider>
                );
                let reduxState = store.getState();
                try {
                	reduxState = JSON.stringify(reduxState).replace(/</g, '\\u003c');
				} catch (e) {
					reduxState = {};
				}
                renderFullPage(appHtml, reduxState, res)
            });
        });
    } else if (process.env.NODE_ENV === 'development') {
		res.sendFile(path.resolve(__dirname, './../public/index.html'));
	}

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