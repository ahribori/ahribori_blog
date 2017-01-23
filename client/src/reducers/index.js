import authentication from './authentication';
import application from './application';
import { combineReducers } from 'redux';
export default combineReducers({
	application,
	authentication
});