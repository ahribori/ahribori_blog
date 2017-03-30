import {
    REGISTER_COMMENT,
    REGISTER_COMMENT_SUCCESS,
    REGISTER_COMMENT_FAILURE,
    MODIFY_COMMENT,
    MODIFY_COMMENT_SUCCESS,
    MODIFY_COMMENT_FAILURE,
    REMOVE_COMMENT,
    REMOVE_COMMENT_SUCCESS,
    REMOVE_COMMENT_FAILURE,
} from './ActionTypes';

import axios from 'axios';

export function registerCommentRequest(token, data) {
    return (dispatch) => {
        dispatch(registerComment());
        return axios({
            method: 'post',
            url: `${process.env.API_SERVER}/api/comment`,
            headers: {
                'authorization': token
            },
            data
        }).then((response) => {
            dispatch(registerCommentSuccess(response.data));
        }).catch((error) => {
            dispatch(registerCommentFailure(error.response));
        })
    }
}

export function registerComment() {
    return {
        type: REGISTER_COMMENT
    }
}

export function registerCommentSuccess(data) {
    return {
        type: REGISTER_COMMENT_SUCCESS,
        data
    }
}

export function registerCommentFailure(error) {
    return {
        type: REGISTER_COMMENT_FAILURE,
        error
    }
}

export function modifyComment() {

}

export function modifyCommentSuccess() {

}

export function modifyCommentFailure() {

}

export function removeComment() {

}

export function removeCommentSuccess() {

}

export function removeCommentFailure() {

}

