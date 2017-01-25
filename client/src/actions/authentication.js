import {
	AUTH_LOGIN,
	AUTH_LOGIN_SUCCESS,
	AUTH_LOGIN_FAILURE,
	AUTH_LOGOUT,
	AUTH_REGISTER,
	AUTH_REGISTER_SUCCESS,
	AUTH_REGISTER_FAILURE,
	AUTH_GET_STATUS,
	AUTH_GET_STATUS_SUCCESS,
	AUTH_GET_STATUS_FAILURE
} from './ActionTypes';

import axios from 'axios';
import config from '../config'

/*============================================================================
 authentication
 ==============================================================================*/

/* LOGIN */
export function loginRequest(username, password) {
	/*
		dispatch를 나중에 하기 위해 thunk를 리턴할거다.
		thunk란 특정 작업을 미루기 위해 특정 작업을 함수로 wrapping 하는 것
	*/
	return (dispatch) => {
		dispatch(login());
		return axios.post(config.AUTH_SERVER + '/auth/login', { username, password})
			.then((response) => {
				dispatch(loginSuccess(response.data));
			})
			.catch((error) => {
				dispatch(loginFailure())
			});
	}
}

export function login() {
	return {
		type: AUTH_LOGIN
	};
}

export function loginSuccess(data) {
	return {
		type: AUTH_LOGIN_SUCCESS,
		data
	};
}

export function loginFailure() {
	return {
		type: AUTH_LOGIN_FAILURE
	};
}

export function logout() {
	return {
		type: AUTH_LOGOUT
	}
}

/* REGISTER */
export function registerRequest(username, password) {
	return (dispatch) => {
		dispatch(register());
		return axios.post(config.AUTH_SERVER + '/auth/register', { username, password})
			.then((response) => {
				dispatch(registerSuccess());
			})
			.catch((error) => {
				dispatch(registerFailure(error.response));
			})
	};
}

export function register() {
	return {
		type: AUTH_REGISTER
	};
}

export function registerSuccess() {
	return {
		type: AUTH_REGISTER_SUCCESS,
	};
}

export function registerFailure(error) {
	return {
		type: AUTH_REGISTER_FAILURE,
		error
	};
}

/* GET STATUS */
export function getStatusRequest(token) {
	return (dispatch) => {
		dispatch(getStatus());
		return axios.get(config.AUTH_SERVER + '/auth/check', {
			headers: {
				'authorization': token
			}
		}).then((response) => {
				dispatch(getStatusSuccess(response.data.info));
			})
			.catch((error) => {
				dispatch(getStatusFailure(error.response));
			});
	};
}

export function getStatus() {
	return {
		type: AUTH_GET_STATUS
	};
}

export function getStatusSuccess(user) {
	return {
		type: AUTH_GET_STATUS_SUCCESS,
		user
	};
}

export function getStatusFailure(error) {
	return {
		type: AUTH_GET_STATUS_FAILURE,
		error
	};
}