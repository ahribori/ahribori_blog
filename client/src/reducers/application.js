import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	sidebar: {
		hidden: true
	}
};

export default function application(state= initialState, action) {
	switch (action.type) {
		case types.SIDEBAR_TOGGLE:
			return update(state, {
				sidebar: {
					hidden: { $set: !state.sidebar.hidden }
				}
			});
		default:
			return state;
	}
}