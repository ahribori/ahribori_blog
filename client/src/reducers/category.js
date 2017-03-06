import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    register: {
        status: 'INIT',
        response: null,
        error: null
    },
    get: {
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

export default function application(state= initialState, action) {
    switch(action.type) {
        case types.REGISTER_CATEGORY:
            return update(state, {
                register: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.REGISTER_CATEGORY_SUCCESS:
            return update(state, {
                register: {
                    status: { $set: 'SUCCESS' },
                    response: { $set: action.response }
                }
            });
        case types.REGISTER_CATEGORY_FAILURE:
            return update(state, {
                register: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.GET_CATEGORY:
            return update(state, {
                get: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.GET_CATEGORY_SUCCESS:
            return update(state, {
                get: {
                    status: { $set: 'SUCCESS' },
                    response: { $set: action.response }
                }
            });
        case types.GET_CATEGORY_FAILURE:
            return update(state, {
                get: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.MODIFY_CATEGORY:
            return update(state, {
                modify: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.MODIFY_CATEGORY_SUCCESS:
            return update(state, {
                modify: {
                    status: { $set: 'SUCCESS' },
                    response: { $set: action.response }
                }
            });
        case types.MODIFY_CATEGORY_FAILURE:
            return update(state, {
                modify: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.REMOVE_CATEGORY:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.REMOVE_CATEGORY_SUCCESS:
            return update(state, {
                remove: {
                    status: { $set: 'SUCCESS' },
                    response: { $set: action.response }
                }
            });
        case types.REMOVE_CATEGORY_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
    }
    return state;
}