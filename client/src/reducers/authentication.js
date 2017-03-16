import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	login: {
		status: 'INIT'
	},
	register: {
		status: 'INIT',
		error: -1
	},
	status: {
		isLoggedIn: false,
		loginType: '',
		accessToken: '',
		refreshToken: '',
		error: -1
	},
	user: null
};

export default function authentication(state= initialState, action) {
	switch (action.type) {
		case types.AUTH_LOGIN:
			return update(state, {
				login: {
					status: { $set: 'WAITING' }
				}
			});
		case types.AUTH_LOGIN_SUCCESS:
			return update(state, {
				login: {
					status: { $set: 'SUCCESS' }
				},
				status: {
					isLoggedIn: { $set: true },
					loginType: { $set: 'AHRIBORI'},
					accessToken: { $set: action.data.token }
				}
			});
		case types.AUTH_LOGIN_FAILURE:
			return update(state, {
				login: {
					status: { $set: 'FAILURE' },
					error: { $set: -1 }
				}
			});
		case types.AUTH_KAKAO_LOGIN:
			return update(state, {
				status: {
					isLoggedIn: { $set: true },
					loginType: { $set: 'KAKAO'},
					accessToken: { $set: action.response.access_token },
					refreshToken: { $set: action.response.refresh_token }
				}
			});
		case types.AUTH_KAKAO_SET_AUTH:
			return update(state, {
				status: {
					isLoggedIn: { $set: true },
					loginType: { $set: 'KAKAO'},
					accessToken: { $set: action.auth.access_token },
					refreshToken: { $set: action.auth.refresh_token }
				}
			});
		case types.AUTH_KAKAO_GET_STATUS:
			return update(state, {
				status: {
					isLoggedIn: { $set: true }
				}
			});
		case types.AUTH_KAKAO_GET_STATUS_SUCCESS:
			return update(state, {
				user: {
					$set: {
						id: action.response.id,
						nickname: action.response.properties.nickname,
						profile_image: action.response.properties.profile_image,
						thumbnail_image: action.response.properties.thumbnail_image
					}
				}
			});
		case types.AUTH_KAKAO_GET_STATUS_FAILURE:
			return update(state, {
				status: {
					isLoggedIn: { $set: false },
					error: { $set: action.error }
				}
			});
		case types.AUTH_KAKAO_LOGOUT:
			return update(state, {
				status: {
					isLoggedIn: { $set: false },
					loginType: { $set: ''},
					accessToken: { $set: '' },
					refreshToken: { $set: '' }
				},
				user: { $set: null }
			});
		case types.AUTH_REGISTER:
			return update(state, {
				register: {
					status: { $set: 'WAITING' }
				}
			});
		case types.AUTH_REGISTER_SUCCESS:
			return update(state, {
				register: {
					status: { $set: 'SUCCESS' }
				}
			});
		case types.AUTH_REGISTER_FAILURE:
			return update(state, {
				register: {
					status: { $set: 'FAILURE' },
					error: { $set: action.error }
				}
			});
		case types.AUTH_LOGOUT:
			return update(state, {
				status: {
					isLoggedIn: { $set: false },
					accessToken: { $set: ''},
					error: { $set: -1 }
				},
				user: { $set: null }
			});
		case types.AUTH_GET_STATUS:
			return update(state, {
				status: {
					isLoggedIn: { $set: true }
				}
			});
		case types.AUTH_GET_STATUS_SUCCESS:
			return update(state, {
				status: {
					loginType: { $set:'AHRIBORI' }
				},
				user: { $set: action.user }
			});
		case types.AUTH_GET_STATUS_FAILURE:
			return update(state, {
				status: {
					isLoggedIn: { $set: false },
					error: { $set: action.error }
				}
			});
		
		default:
			return state;
	}
}