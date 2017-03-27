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
    AUTH_GET_STATUS_FAILURE,
    OAUTH_LOGIN,
    OAUTH_LOGIN_SUCCESS,
    OAUTH_LOGIN_FAILURE,
} from './ActionTypes';

import axios from 'axios';

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
		return axios.post(process.env.AUTH_SERVER + '/auth/login', { username, password })
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
export function registerRequest(username, password, nickname) {
	return (dispatch) => {
		dispatch(register());
		return axios.post(process.env.AUTH_SERVER + '/auth/register', { username, password, nickname })
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
		type: AUTH_REGISTER_SUCCESS
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
		return axios.get(process.env.AUTH_SERVER + '/auth/check', {
			headers: {
				'authorization': token
			}
		}).then((response) => {
				response.data.info.token = token;
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

/* oAUTH */

export function oAuthLoginRequest(account_type, social_id, nickname, thumbnail_image) {
    return (dispatch) => {
        dispatch(oAuthLogin());
        return axios.post(process.env.AUTH_SERVER + '/auth/oauth', {
        	account_type,
			social_id,
			nickname,
			thumbnail_image
		})
            .then((response) => {
                dispatch(oAuthLoginSuccess(response.data));
            })
            .catch((error) => {
                dispatch(oAuthLoginFailure(error.response));
            });
    };
}

export function oAuthLogin() {
    return {
        type: OAUTH_LOGIN
    };
}
export function oAuthLoginSuccess(response) {
    return {
        type: OAUTH_LOGIN_SUCCESS,
		response
    };
}
export function oAuthLoginFailure(error) {
    return {
        type: OAUTH_LOGIN_FAILURE,
		error
    };
}

