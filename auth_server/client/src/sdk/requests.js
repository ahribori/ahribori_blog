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
    const successCallback = AHRIBORI_AUTH_SDK.callback.checkTokenSuccess;
    const failCallback = AHRIBORI_AUTH_SDK.callback.checkTokenFail;
    const alwaysCallback = AHRIBORI_AUTH_SDK.callback.checkTokenAlways;
    if (token) {
        return axios({
            url: `${process.env.SERVER_URL}/auth/check`,
            method: 'GET',
            headers: {
                Authorization: token
            }
        }).then((response) => {
            if (successCallback) successCallback(response.data);
            if (alwaysCallback) alwaysCallback(response.data);
        }).catch((error) => {
			localStorage.removeItem('ahribori_token');
            if (failCallback) failCallback(error.response.data);
            if (alwaysCallback) alwaysCallback(error.response.data);
        });
    } else {
        const failObject = {
            success: false,
            message: 'token not exist'
        };
        if (failCallback) failCallback(failObject);
        if (alwaysCallback) alwaysCallback(failObject);
    }
}

export function checkTokenPromise(_token) {
	const token = _token || localStorage.getItem('ahribori_token');
	return new Promise((resolve, reject) => {
		if (token) {
			axios({
				url: `${process.env.SERVER_URL}/auth/check`,
				method: 'GET',
				headers: {
					Authorization: token
				}
			}).then((response) => {
				resolve(response.data);
			}).catch((error) => {
				localStorage.removeItem('ahribori_token');
				reject(error.response.data);
			});
		} else {
			reject({
				success: false,
				message: 'token not exist'
			})
		}
	});
}
