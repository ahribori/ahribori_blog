import app from './app';
import authentication from './authentication';
import article from './article';

import { combineReducers } from 'redux';
export default combineReducers({
	app,
	authentication,
	article
});