import axios from 'axios';

export function initializeSDK(applicationKey) {
    return axios({
        url: `${process.env.SERVER_URL}/auth/initializeSDK`,
        method: 'GET',
        headers: {
            Authorization: applicationKey
        }
    }).then((response) => {
        console.log('[AHRIBORI_AUTH_SDK] 성공적으로 초기화되었습니다');
        return response.data.success;
    }).catch((error) => {
        const statusCode = error.response.status;
        if (statusCode === 401) {
            console.error('[AHRIBORI_AUTH_SDK] Application key가 존재하지 않아 AHRIBORI_AUTH_SDK 초기화에 실패하였습니다');
        } else if (statusCode === 403) {
            console.error('[AHRIBORI_AUTH_SDK] Application key가 유효하지 않아 AHRIBORI_AUTH_SDK 초기화에 실패하였습니다');
        }
        return false;
    });
}

export function checkToken(_token) {
    const token = _token || localStorage.getItem('ahribori_token');
    if (token) {
        return axios({
            url: `${process.env.SERVER_URL}/auth/check`,
            method: 'GET',
            headers: {
                Authorization: token
            }
        }).then((response) => {
            const successCallback = AHRIBORI_AUTH_SDK.callback.checkTokenSuccess;
            const alwaysCallback = AHRIBORI_AUTH_SDK.callback.checkTokenAlways;
            if (successCallback) successCallback(response.data);
            if (alwaysCallback) alwaysCallback(response.data);
        }).catch((error) => {
            const failCallback = AHRIBORI_AUTH_SDK.callback.checkTokenFail;
            const alwaysCallback = AHRIBORI_AUTH_SDK.callback.checkTokenAlways;
            if (failCallback) failCallback(error.response.data);
            if (alwaysCallback) alwaysCallback(error.response.data);
        });
    }
}
