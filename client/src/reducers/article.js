import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	articleList: {
		status: 'INIT',
		offset: 0,
		limit: 10,
		data: [],
		error: null
	},
	article: {
		data: {}
	},
	article_temp: {
		data: {},
		error: null
	},
	register: {
		status: 'INIT',
		error: null
	},
	modify: {
		status: 'INIT',
		error: null
	},
	remove: {
        status: 'INIT',
        error: null
	},
	register_temp: {
		status: 'INIT',
		error: null
	},
	modify_temp: {
		status: 'INIT',
		error: null
	},
	remove_temp: {
        status: 'INIT',
        error: null
	}
};

export default function application(state= initialState, action) {
	switch(action.type) {
		case types.GET_ARTICLE_LIST:
            return update(state, {
                articleList: {
                	status: { $set: 'WAITING' },
                    error: { $set: null }
                }
            });
		case types.GET_ARTICLE_LIST_SUCCESS:
			return update(state, {
				articleList: {
                    status: { $set: 'SUCCESS' },
					offset: { $set: action.offset },
					limit: { $set: action.limit },
					data: { $set: action.articles },
					error: { $set: null }
				}
			});
		case types.GET_ARTICLE_LIST_FAILURE:
			return update(state, {
				articleList: {
                    status: { $set: 'FAILURE' },
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
					error: { $set: null }
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
		case types.MODIFY_ARTICLE:
            return update(state, {
                modify: {
                    status: { $set: 'WAITING'},
                    error: { $set: null }
                }
            });
		case types.MODIFY_ARTICLE_SUCCESS:
            return update(state, {
                modify: {
                    status: { $set: 'SUCCESS'},
                }
            });
		case types.MODIFY_ARTICLE_FAILURE:
            return update(state, {
                modify: {
                    status: { $set: 'FAILURE'},
                    error: { $set: action.error }
                }
            });
        case types.REMOVE_ARTICLE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING'},
                    error: { $set: null }
                }
            });
        case types.REMOVE_ARTICLE_SUCCESS:
            return update(state, {
                remove: {
                    status: { $set: 'SUCCESS'},
                }
            });
        case types.REMOVE_ARTICLE_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE'},
                    error: { $set: action.error }
                }
            });
		case types.REGISTER_ARTICLE_TEMP:
			return update(state, {
				register_temp: {
					status: { $set: 'WAITING'},
					error: { $set: null }
				}
			});
		case types.REGISTER_ARTICLE_TEMP_SUCCESS:
			return update(state, {
				register_temp: {
					status: { $set: 'SUCCESS'}
				}
			});
		case types.REGISTER_ARTICLE_TEMP_FAILURE:
			return update(state, {
				register_temp: {
					status: { $set: 'FAILURE'},
					error: { $set: action.error }
				}
			});
		case types.GET_ARTICLE_TEMP:
			return state;
		case types.GET_ARTICLE_TEMP_SUCCESS:
			return update(state, {
				article_temp: {
					data: { $set: action.article_temp },
					error: { $set: null }
				}
			});
		case types.GET_ARTICLE_TEMP_FAILURE:
			return update(state, {
				article_temp: {
					error: { $set: action.error }
				}
			});
		case types.MODIFY_ARTICLE_TEMP:
			return update(state, {
				modify_temp: {
					status: { $set: 'WAITING' }
				}
			});
		case types.MODIFYT_ARTICLE_TEMP_SUCCESS:
			return update(state, {
				modify_temp: {
					status: { $set: 'SUCCESS' },
					error: { $set: null }
				}
			});
		case types.MODIFY_ARTICLE_TEMP_FAILURE:
			return update(state, {
				modify_temp: {
					status: { $set: 'FAILURE' },
					error: { $set: action.error }
				}
			});
        case types.REMOVE_ARTICLE_TEMP:
            return update(state, {
                remove_temp: {
                    status: { $set: 'WAITING'},
                    error: { $set: null }
                }
            });
        case types.REMOVE_ARTICLE_TEMP_SUCCESS:
            return update(state, {
                remove_temp: {
                    status: { $set: 'SUCCESS'},
                }
            });
        case types.REMOVE_ARTICLE_TEMP_FAILURE:
            return update(state, {
                remove_temp: {
                    status: { $set: 'FAILURE'},
                    error: { $set: action.error }
                }
            });
	}
	return state;
}