import {
    REGISTER_CATEGORY,
    REGISTER_CATEGORY_SUCCESS,
    REGISTER_CATEGORY_FAILURE,
    GET_CATEGORY,
    GET_CATEGORY_SUCCESS,
    GET_CATEGORY_FAILURE,
    MODIFY_CATEGORY,
    MODIFY_CATEGORY_SUCCESS,
    MODIFY_CATEGORY_FAILURE,
    REMOVE_CATEGORY,
    REMOVE_CATEGORY_SUCCESS,
    REMOVE_CATEGORY_FAILURE,
} from './ActionTypes';

import axios from 'axios';
import config from '../config'

export function registerCategoryRequest(category, token) {
    return (dispatch) => {
        dispatch(registerCategory());
        return axios({
            url: `${config.API_SERVER}/api/category`,
            method: 'post',
            data: category,
            headers: {
                'authorization': token
            },
        })
            .then((response) => {
                dispatch(registerCategorySuccess(response.data));
            })
            .catch((error) => {
                dispatch(registerCategoryFailure(error.response));
            })
    }
}

export function registerCategory() {
    return {
        type: REGISTER_CATEGORY
    }
}

export function registerCategorySuccess(response) {
    return {
        type: REGISTER_CATEGORY_SUCCESS,
        response
    }
}

export function registerCategoryFailure(error) {
    return {
        type: REGISTER_CATEGORY_FAILURE,
        error
    }
}

export function getCategoryRequest(token) {
    return (dispatch) => {
        dispatch(getCategory());
        return axios({
            url: `${config.API_SERVER}/api/category`,
            method: 'get',
            headers: {
                'authorization': token
            },
        })
            .then((response) => {
                dispatch(getCategorySuccess(response.data));
            })
            .catch((error) => {
                dispatch(getCategoryFailure(error.response));
            })
    }
}

export function getCategory() {
    return {
        type: GET_CATEGORY
    }
}

export function getCategorySuccess(response) {
    return {
        type: GET_CATEGORY_SUCCESS,
        response
    }
}

export function getCategoryFailure(error) {
    return {
        type: GET_CATEGORY_FAILURE,
        error
    }
}

export function modifyCategoryRequest(category, token) {
    return (dispatch) => {
        dispatch(modifyCategory());
        return axios({
            url: `${config.API_SERVER}/api/category/${category._id}`,
            method: 'put',
            data: category,
            headers: {
                'authorization': token
            },
        })
            .then((response) => {
                dispatch(modifyCategorySuccess(response.data));
            })
            .catch((error) => {
                dispatch(modifyCategoryFailure(error.response));
            })
    }
}

export function modifyCategory() {
    return {
        type: MODIFY_CATEGORY
    }
}

export function modifyCategorySuccess(response) {
    return {
        type: MODIFY_CATEGORY_SUCCESS,
        response
    }
}

export function modifyCategoryFailure(error) {
    return {
        type: MODIFY_CATEGORY_FAILURE,
        error
    }
}

export function removeCategoryRequest(category, token) {
    return (dispatch) => {
        dispatch(removeCategory());
        return axios({
            url: `${config.API_SERVER}/api/category/${category._id}`,
            method: 'delete',
            headers: {
                'authorization': token
            },
        })
            .then((response) => {
                dispatch(removeCategorySuccess(response.data));
            })
            .catch((error) => {
                dispatch(removeCategoryFailure(error.response));
            })
    }
}

export function removeCategory() {
    return {
        type: REMOVE_CATEGORY
    }
}

export function removeCategorySuccess(response) {
    return {
        type: REMOVE_CATEGORY_SUCCESS,
        response
    }
}

export function removeCategoryFailure(error) {
    return {
        type: REMOVE_CATEGORY_FAILURE,
        error
    }
}