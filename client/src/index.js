/* =========================================
 Load react dependencies
 ============================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { App, Login, Home, Article, Register, Write, NotFound } from 'containers';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/* =========================================
 Load redux dependencies
 ============================================*/
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';

const middlewares = [thunk];
if (process.env.NODE_ENV === 'development') {
	const createLogger = require('redux-logger');
	const logger = createLogger();
	middlewares.push(logger);
}
const store = compose(applyMiddleware(...middlewares))(createStore)(reducers);

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
 Render
 ============================================*/
const rootElement = document.getElementById('app');
ReactDOM.render(
	<MuiThemeProvider>
		<Provider store={store}>
			<Router history={browserHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={Home}/>
					<Route path="" component={Home}/>
					<Route path="article" component={Article}>
						<Route path=":id" component={Article} />
					</Route>
					<Route path="login" component={Login}/>
					<Route path="register" component={Register}/>
					<Route path="write" component={Write}/>
					<Route path="*" component={NotFound} />
					//	여기는 react-codelab 프로젝트를 참조해서 작성해
				</Route>
			</Router>
		</Provider>
	</MuiThemeProvider>
	, rootElement);