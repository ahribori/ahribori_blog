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
			})
	}
	return state;
}