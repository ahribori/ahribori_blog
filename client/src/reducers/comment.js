import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    register: {
        status: 'INIT',
        response: null,
        error: null
    },
    modify: {
        status: 'INIT',
        response: null,
        error: null
    },
    remove: {
        status: 'INIT',
        response: null,
        error: null
    }
};

export default function comment(state= initialState, action) {
    switch(action.type) {
        case types.REGISTER_COMMENT:
            return update(state, {
                register: {
                    status: { $set: 'WAITING' },
                    error: { $set: null }
                }
            });
        case types.REGISTER_COMMENT_SUCCESS:
            return update(state, {
                register: {
                    status: { $set: 'SUCCESS' },
                    response: { $set: action.data }
                }
            });
        case types.REGISTER_COMMENT_FAILURE:
            return update(state, {
                register: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
		case types.REMOVE_COMMENT:
			return update(state, {
				remove: {
					status: { $set: 'WAITING' },
					error: { $set: null }
				}
			});
		case types.REMOVE_COMMENT_SUCCESS:
			return update(state, {
				remove: {
					status: { $set: 'SUCCESS' },
					response: { $set: action.data }
				}
			});
		case types.REMOVE_COMMENT_FAILURE:
			return update(state, {
				remove: {
					status: { $set: 'FAILURE' },
					error: { $set: action.error }
				}
			});
    }
    return state;
}