import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './components/App';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const rootElement = document.getElementById('app');
ReactDOM.render(
	<MuiThemeProvider>
		<App/>
	</MuiThemeProvider>
	, rootElement);