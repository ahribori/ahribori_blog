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
	REMOVE_ARTICLE_FAILURE
} from './ActionTypes';

import axios from 'axios';
import config from '../config';

export function getArticleListRequest(offset, limit, token) {
	return (dispatch) => {
		dispatch(getArticleList());
		return axios.get(`${config.API_SERVER}/api/article?offset=${offset}&limit=${limit}`, {
			headers: {
				'authorization': token || config.TOKEN
			}
		}).then((response) => {
			dispatch(getArticleListSuccess(offset, limit, response.data))
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

export function getArticleListSuccess(offset, limit, articles) {
	return {
		type: GET_ARTICLE_LIST_SUCCESS,
		offset,
		limit,
		articles
	}
}

export function getArticleListFailure(error) {
	return {
		type: GET_ARTICLE_LIST_FAILURE,
		error
	}
}

export function registerArticleRequest(token, article) {
	return (dispatch) => {
		dispatch(registerArticle());
		return axios({
			method: 'post',
			url: `${config.API_SERVER}/api/article`,
			headers: {
				'authorization': token
			},
			data: {
				category: article.category,
				author: article.author,
				title: article.title,
				content: article.content,
				hidden: article.hidden
			}
		}).then((response) => {
			dispatch(registerArticleSuccess(response.data))
		}).catch((error) => {
			dispatch(registerArticleFailure(error.response))
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
		type: REGISTER_ARTICLE_SUCCESS
	}
}

export function registerArticleFailure(error) {
	return {
		type: REGISTER_ARTICLE_FAILURE
	}
}