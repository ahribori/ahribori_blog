/* =========================================
 Load react dependencies
 ============================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Router,browserHistory } from 'react-router';
import routes from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/* =========================================
 Load redux dependencies
 ============================================*/
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const middlewares = [thunk];
if (process.env.NODE_ENV === 'development') {
	const createLogger = require('redux-logger');
	const logger = createLogger();
	// middlewares.push(logger);
}
let preloadedState = {};
if (typeof window !== 'undefined') { preloadedState = window.__REDUX_STATE__; }
const store = createStore(reducers, preloadedState, compose(applyMiddleware(...middlewares)));

/* =========================================
 Load MDL dependencies
 ============================================*/
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

/* =========================================
 Load Material-UI dependencies
 ============================================*/
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/* =========================================
 Load Custom Style
 ============================================*/
import './style.scss';

/* =========================================
 Render
 ============================================*/
const rootElement = document.getElementById('app');
ReactDOM.render(
	<MuiThemeProvider>
		<Provider store={store}>
			<Router onUpdate={() => { document.querySelector('.mdl-layout__content').scrollTop = 0; }} history={browserHistory}>
				{routes}
			</Router>
		</Provider>
	</MuiThemeProvider>
	, rootElement);