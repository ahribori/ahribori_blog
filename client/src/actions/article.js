import {
	GET_ARTICLE_LIST,
	GET_ARTICLE_LIST_SUCCESS,
	GET_ARTICLE_LIST_FAILURE,
	GET_ARTICLE,
	GET_ARTICLE_SUCCESS,
	GET_ARTICLE_FAILURE,
	REGISTER_ARTICLE,
	REGISTER_ARTICLE_SUCCESS,
	REGISTER_ARTICLE_FAILURE,
	MODIFY_ARTICLE,
	MODIFY_ARTICLE_SUCCESS,
	MODIFY_ARTICLE_FAILURE,
	REMOVE_ARTICLE,
	REMOVE_ARTICLE_SUCCESS,
	REMOVE_ARTICLE_FAILURE,
	GET_ARTICLE_TEMP,
	GET_ARTICLE_TEMP_SUCCESS,
	GET_ARTICLE_TEMP_FAILURE,
	REGISTER_ARTICLE_TEMP,
	REGISTER_ARTICLE_TEMP_SUCCESS,
	REGISTER_ARTICLE_TEMP_FAILURE,
	MODIFY_ARTICLE_TEMP,
	MODIFY_ARTICLE_TEMP_SUCCESS,
	MODIFY_ARTICLE_TEMP_FAILURE,
	REMOVE_ARTICLE_TEMP,
	REMOVE_ARTICLE_TEMP_SUCCESS,
	REMOVE_ARTICLE_TEMP_FAILURE
} from './ActionTypes';

import axios from 'axios';
import moment from 'moment';

export function getArticleListRequest(token, query) {
	let url = `${process.env.API_SERVER}/api/article?`;
	if (query.offset !== undefined && !isNaN(Number(query.offset))) {
		url += `offset=${query.offset}&`;
	}
	if (query.limit !== undefined && !isNaN(Number(query.limit))) {
		url += `limit=${query.limit}&`;
	}
	if (query.category !== undefined) {
		url += `category=${query.category}&`;
	}
	if (query.search !== undefined) {
		url += `search=${query.search}&`;
	}

	return (dispatch) => {
		dispatch(getArticleList());
		return axios.get(url, {
			headers: {
				'authorization': token || process.env.TOKEN
			}
		}).then((response) => {
			dispatch(getArticleListSuccess(query.offset, query.limit, response.data.articles, response.data.page))
		}).catch((error) => {
			dispatch(getArticleListFailure(error.response))
		})
	}
}

export function getArticleList() {
	return {
		type: GET_ARTICLE_LIST
	}
}

export function getArticleListSuccess(offset, limit, articles, page) {
	return {
		type: GET_ARTICLE_LIST_SUCCESS,
		offset,
		limit,
		articles,
		page
	}
}

export function getArticleListFailure(error) {
	return {
		type: GET_ARTICLE_LIST_FAILURE,
		error
	}
}

export function getArticleRequest(id, token, upHits) {
	return (dispatch) => {
		dispatch(getArticle());
		return axios.get(`${process.env.API_SERVER}/api/article/${id}`, {
			headers: {
				'authorization': token || process.env.TOKEN,
				'X-h': upHits || 0
			}
		}).then((response) => {
			dispatch(getArticleSuccess(response.data))
		}).catch((error) => {
			dispatch(getArticleFailure(error.response))
		})
	}
}

export function getArticle() {
	return {
		type: GET_ARTICLE
	}
}

export function getArticleSuccess(data) {
	data.article.reg_date = moment(new Date(data.article.reg_date)).format('YYYY.MM.DD hh:mm');
	data.article.comments_count = data.comments.length;
	return {
		type: GET_ARTICLE_SUCCESS,
		article: data.article,
		comments: data.comments
	}
}

export function getArticleFailure(error) {
	return {
		type: GET_ARTICLE_FAILURE,
		error
	}
}

export function registerArticleRequest(token, article) {
	return (dispatch) => {
		dispatch(registerArticle());
		return axios({
			method: 'post',
			url: `${process.env.API_SERVER}/api/article`,
			headers: {
				'authorization': token
			},
			data: {
				category: article.category,
				author_id: article.author_id,
				author_nickname: article.author_nickname,
				title: article.title,
				content: article.content,
				preview: article.preview,
				hidden: article.hidden,
				article_temp_id: article.article_temp_id
			}
		}).then((response) => {
			dispatch(registerArticleSuccess(response.data));
		}).catch((error) => {
			dispatch(registerArticleFailure(error.response));
		})
	}
}

export function registerArticle() {
	return {
		type: REGISTER_ARTICLE
	}
}

export function registerArticleSuccess(result) {
	return {
		type: REGISTER_ARTICLE_SUCCESS,
		result
	}
}

export function registerArticleFailure(error) {
	return {
		type: REGISTER_ARTICLE_FAILURE,
		error
	}
}

export function modifyArticleRequest(token, article) {
	return (dispatch) => {
		dispatch(modifyArticle());
		return axios({
			method: 'put',
			url: `${process.env.API_SERVER}/api/article/${article._id}`,
			headers: {
				'authorization': token
			},
			data: article
		}).then((response) => {
			dispatch(modifyArticleSuccess(response.data));
		}).catch((error) => {
			dispatch(modifyArticleFailure(error.response));
		})
	}
}

export function modifyArticle() {
	return {
		type: MODIFY_ARTICLE
	}
}

export function modifyArticleSuccess(result) {
	return {
		type: MODIFY_ARTICLE_SUCCESS,
		result
	}
}

export function modifyArticleFailure(error) {
	return {
		type: MODIFY_ARTICLE_FAILURE,
		error
	}
}

export function removeArticleRequest(token, article_id) {
	return (dispatch) => {
		dispatch(removeArticle());
		return axios({
            method: 'delete',
            url: `${process.env.API_SERVER}/api/article/${article_id}`,
            headers: {
                'authorization': token
            }
        }).then((response) => {
            dispatch(removeArticleSuccess(response.data));
        }).catch((error) => {
            dispatch(removeArticleFailure(error.response));
        })
	}
}

export function removeArticle() {
	return {
		type: REMOVE_ARTICLE
	}
}

export function removeArticleSuccess(response) {
	return {
		type: REMOVE_ARTICLE_SUCCESS,
		response
	}
}

export function removeArticleFailure(error) {
	return {
		type: REMOVE_ARTICLE_FAILURE,
		error
	}
}

export function getArticleTempRequest(token) {
	return (dispatch) => {
		dispatch(getArticleTemp());
		return axios.get(`${process.env.API_SERVER}/api/article_temp`, {
			headers: {
				'authorization': token
			}
		}).then((response) => {
			dispatch(getArticleTempSuccess(response.data))
		}).catch((error) => {
			dispatch(getArticleTempFailure(error.response))
		})
	}
}

export function getArticleTemp() {
	return {
		type: GET_ARTICLE_TEMP
	}
}

export function getArticleTempSuccess(article_temp) {
	return {
		type: GET_ARTICLE_TEMP_SUCCESS,
		article_temp
	}
}

export function getArticleTempFailure(error) {
	return {
		type: GET_ARTICLE_TEMP_FAILURE,
		error
	}
}

export function registerArticleTempRequest(token, article) {
	return (dispatch) => {
		dispatch(registerArticleTemp());
		return axios({
			method: 'post',
			url: `${process.env.API_SERVER}/api/article_temp`,
			headers: {
				'authorization': token
			},
			data: {
				category: article.category,
				author_id: article.author_id,
				author_nickname: article.author_nickname,
				title: article.title,
				content: article.content,
				hidden: article.hidden
			}
		}).then((response) => {
			dispatch(registerArticleTempSuccess(response.data))
		}).catch((error) => {
			dispatch(registerArticleTempFailure(error.response))
		})
	}
}

export function registerArticleTemp() {
	return {
		type: REGISTER_ARTICLE_TEMP
	}
}

export function registerArticleTempSuccess(result) {
	return {
		type: REGISTER_ARTICLE_TEMP_SUCCESS,
		result
	}
}

export function registerArticleTempFailure(error) {
	return {
		type: REGISTER_ARTICLE_TEMP_FAILURE,
		error
	}
}


export function modifyArticleTempRequest(token, article_temp) {
	return (dispatch) => {
		dispatch(modifyArticleTemp());
		return axios({
			method: 'put',
			url: `${process.env.API_SERVER}/api/article_temp/${article_temp._id}`,
			headers: {
				'authorization': token
			},
			data: article_temp
		}).then((response) => {
			dispatch(modifyArticleTempSuccess(response.data));
		}).catch((error) => {
			dispatch(modifyArticleTempFailure(error.response));
		})
	}
}

export function modifyArticleTemp() {
	return {
		type: MODIFY_ARTICLE_TEMP
	}
}

export function modifyArticleTempSuccess(result) {
	return {
		type: MODIFY_ARTICLE_TEMP_SUCCESS,
		result
	}
}

export function modifyArticleTempFailure(error) {
	return {
		type: MODIFY_ARTICLE_TEMP_FAILURE,
		error
	}
}

export function removeArticleTempRequest(token, article_temp_id) {
    return (dispatch) => {
        dispatch(removeArticleTemp());
        return axios({
            method: 'delete',
            url: `${process.env.API_SERVER}/api/article_temp/${article_temp_id}`,
            headers: {
                'authorization': token
            }
        }).then((response) => {
            dispatch(removeArticleTempSuccess(response.data));
        }).catch((error) => {
            dispatch(removeArticleTempFailure(error.response));
        })
    }
}

export function removeArticleTemp() {
    return {
        type: REMOVE_ARTICLE_TEMP
    }
}

export function removeArticleTempSuccess(response) {
    return {
        type: REMOVE_ARTICLE_TEMP_SUCCESS,
        response
    }
}

export function removeArticleTempFailure(error) {
    return {
        type: REMOVE_ARTICLE_TEMP_FAILURE,
        error
    }
}