import authentication from './authentication';
import app from './app';
import { combineReducers } from 'redux';
export default combineReducers({
	app,
	authentication
});