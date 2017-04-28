/* eslint-disable no-unused-vars */
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function initializeSDK(applicationKey) {
    return axios({
        url: `${process.env.SERVER_URL}/auth/initializeSDK`,
        method: 'GET',
        headers: {
            Authorization: applicationKey
        }
    }).then((response) => {
        console.log('[WEBAPM_AUTH_SDK] 성공적으로 초기화되었습니다');
        return response.data.success;
    }).catch((error) => {
        const statusCode = error.response.status;
        if (statusCode === 401) {
            console.error('[WEBAPM_AUTH_SDK] Application key가 존재하지 않아 WEBAPM_AUTH_SDK 초기화에 실패하였습니다');
        } else if (statusCode === 403) {
            console.error('[WEBAPM_AUTH_SDK] Application key가 유효하지 않아 WEBAPM_AUTH_SDK 초기화에 실패하였습니다');
        }
        return false;
    });
}
