import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	articleList: {
		offset: 0,
		limit: 10,
		data: [],
		error: null
	},
	article: {
		data: {}
	},
	register: {
		status: 'INIT',
		error: null
	}
};

export default function application(state= initialState, action) {
	switch(action.type) {
		case types.GET_ARTICLE_LIST:
			return state;
		case types.GET_ARTICLE_LIST_SUCCESS:
			return update(state, {
				articleList: {
					offset: { $set: action.offset },
					limit: { $set: action.limit },
					data: { $set: action.articles },
					error: { $set: null }
				}
			});
		case types.GET_ARTICLE_LIST_FAILURE:
			return update(state, {
				articleList: {
					error: { $set: action.error }
				}
			});
		case types.GET_ARTICLE:
			return state;
		case types.GET_ARTICLE_SUCCESS:
			return update(state, {
				article: {
					data: { $set: action.article },
					error: { $set: null }
				}
			});
		case types.GET_ARTICLE_FAILURE:
			return update(state, {
				articleList: {
					error: { $set: action.error }
				}
			});
		case types.REGISTER_ARTICLE:
			return update(state, {
				register: {
					status: { $set: 'WAITING'},
					error: { $set: action.null }
				}
			});
		case types.REGISTER_ARTICLE_SUCCESS:
			return update(state, {
				register: {
					status: { $set: 'SUCCESS'},
				}
			});
		case types.REGISTER_ARTICLE_FAILURE:
			return update(state, {
				register: {
					status: { $set: 'FAILURE'},
					error: { $set: action.error }
				}
			});
	}
	return state;
}