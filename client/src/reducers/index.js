import app from './app';
import authentication from './authentication';
import article from './article';
import category from './category';
import comment from './comment';

import { combineReducers } from 'redux';
export default combineReducers({
	app,
	authentication,
	article,
	category,
	comment
});