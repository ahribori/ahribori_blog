/**
 * Helpers module
 * @module helpers
 */

/**
 * 메세지를 심각도에 따라 출력
 * @param severity
 * @param message
 */
export function printMessage(severity, message) {
    const text = `[AHRIBORI_AUTH_SDK] ${message}`;
    switch (severity) {
        case 'error':
            console.error(text);
            break;
        case 'warn' :
            console.warn(text);
            break;
        case 'info' :
            console.info(text);
            break;
        default :
            console.log(text);
    }
}

/**
 * createLoginButton 요청 파라미터를 검증하고 성공/실패를 반환
 * @param container
 * @param success
 * @param fail
 * @param always
 * @returns {boolean}
 */
export function validateCreateLoginButtonParameters({ container, success, fail, always }) {
    const selectedContainer = document.querySelector(container);
    if (!container) {
        printMessage('error', 'container 파라미터가 지정되지 않았습니다.');
        return false;
    }
    if (!selectedContainer) {
        printMessage('error', 'container 셀렉터가 DOM을 찾지 못했습니다. 올바른 셀렉터를 입력하세요.');
        return false;
    }
    if (success && typeof success !== 'function') {
        printMessage('error', 'success 파라미터는 function 이어야 합니다.');
        return false;
    }
    if (fail && typeof fail !== 'function') {
        printMessage('error', 'fail 파라미터는 function 이어야 합니다.');
        return false;
    }
    if (always && typeof always !== 'function') {
        printMessage('error', 'always 파라미터는 function 이어야 합니다.');
        return false;
    }
    return true;
}

/**
 * Login 요청 파라미터를 검증하고 성공/실패를 반환
 * @param target
 * @param success
 * @param fail
 * @param always
 * @returns {boolean}
 */
export function validateLoginParameters({ target, success, fail, always }) {
    const selectedContainer = document.querySelector(target);
    if (!target) {
        printMessage('error', 'target 파라미터가 지정되지 않았습니다.');
        return false;
    }
    if (!selectedContainer) {
        printMessage('error', 'target 셀렉터가 DOM을 찾지 못했습니다. 올바른 셀렉터를 입력하세요.');
        return false;
    }
    if (success && typeof success !== 'function') {
        printMessage('error', 'success 파라미터는 function 이어야 합니다.');
        return false;
    }
    if (fail && typeof fail !== 'function') {
        printMessage('error', 'fail 파라미터는 function 이어야 합니다.');
        return false;
    }
    if (always && typeof always !== 'function') {
        printMessage('error', 'always 파라미터는 function 이어야 합니다.');
        return false;
    }
    return true;
}

export function validateCheckTokenParameters({ success, fail, always }) {
    if (success && typeof success !== 'function') {
        printMessage('error', 'success 파라미터는 function 이어야 합니다.');
        return false;
    }
    if (fail && typeof fail !== 'function') {
        printMessage('error', 'fail 파라미터는 function 이어야 합니다.');
        return false;
    }
    if (always && typeof always !== 'function') {
        printMessage('error', 'always 파라미터는 function 이어야 합니다.');
        return false;
    }
    return true;
}

/**
 * window.AHRIBORI_AUTH_SDK.callback object에 callback function들을 바인딩
 * @param success
 * @param fail
 * @param always
 */
export function bindCreateLoginButtonCallback({ success, fail, always }) {
    if (!window.AHRIBORI_AUTH_SDK.callback) {
        Object.defineProperties(window.AHRIBORI_AUTH_SDK, {
            callback: {
                value: {},
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }
    Object.defineProperties(window.AHRIBORI_AUTH_SDK.callback, {
        createLoginButtonSuccess: {
            value: success,
            writable: false,
            enumerable: false,
            configurable: false
        },
        createLoginButtonFail: {
            value: fail,
            writable: false,
            enumerable: false,
            configurable: false
        },
        createLoginButtonAlways: {
            value: always,
            writable: false,
            enumerable: false,
            configurable: false
        }
    });
}

/**
 * window.AHRIBORI_AUTH_SDK.callback object에 callback function들을 바인딩
 * @param success
 * @param fail
 * @param always
 */
export function bindLoginCallback({ success, fail, always }) {
    if (!window.AHRIBORI_AUTH_SDK.callback) {
        Object.defineProperties(window.AHRIBORI_AUTH_SDK, {
            callback: {
                value: {},
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }
    Object.defineProperties(window.AHRIBORI_AUTH_SDK.callback, {
        loginSuccess: {
            value: success,
            writable: false,
            enumerable: false,
            configurable: false
        },
        loginFail: {
            value: fail,
            writable: false,
            enumerable: false,
            configurable: false
        },
        loginAlways: {
            value: always,
            writable: false,
            enumerable: false,
            configurable: false
        }
    });
}

export function bindCheckTokenCallback({ success, fail, always }) {
    if (!window.AHRIBORI_AUTH_SDK.callback) {
        Object.defineProperties(window.AHRIBORI_AUTH_SDK, {
            callback: {
                value: {},
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }
    if (!window.AHRIBORI_AUTH_SDK.callback.checkTokenSuccess) {
        Object.defineProperties(window.AHRIBORI_AUTH_SDK.callback, {
            checkTokenSuccess: {
                value: success,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }
    if (!window.AHRIBORI_AUTH_SDK.callback.checkTokenFail) {
        Object.defineProperties(window.AHRIBORI_AUTH_SDK.callback, {
            checkTokenFail: {
                value: fail,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }
    if (!window.AHRIBORI_AUTH_SDK.callback.checkTokenAlways) {
        Object.defineProperties(window.AHRIBORI_AUTH_SDK.callback, {
            checkTokenAlways: {
                value: always,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }
}

/**
 * createLoginButton으로 생성된 버튼을 클릭해서 만들어진 팝업창에서
 * postMessageAPI로 전송한 메세지를 받는 이벤트리스너를 바인딩
 */
export function bindCreateLoginButtonMessageEventLister({ container }) {
    window.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        const iFrame = document.querySelector(`${container} iframe`);
        if (message.type === 'createButtonOnload') {
            if (iFrame) {
                document.querySelector(`${container} iframe`).height = message.style.height;
                document.querySelector(`${container} iframe`).width = message.style.width;
            }
        } else if (message.type === 'oncreatebuttonlogin') {
            const successCallback = window.AHRIBORI_AUTH_SDK.callback.createLoginButtonSuccess;
            const failCallback = window.AHRIBORI_AUTH_SDK.callback.createLoginButtonFail;
            const alwaysCallback = window.AHRIBORI_AUTH_SDK.callback.createLoginButtonAlways;
            if (message.success === true) {
                const successObject = {
                    success: message.success,
                    auth: message.auth
                };
                if (window.localStorage) {
                    localStorage.setItem('ahribori_token', message.auth.token);
                }
                if (successCallback && typeof successCallback === 'function') successCallback(successObject);
                if (alwaysCallback && typeof alwaysCallback === 'function') alwaysCallback(successObject);
            } else if (message.success === false) {
                const failObject = {
                    success: message.success,
                    error: message.error
                };
                if (failCallback && typeof failCallback === 'function') failCallback(failObject);
                if (alwaysCallback && typeof alwaysCallback === 'function') alwaysCallback(failObject);
            }
        } else if (message.type === 'getToken') {
            const token = localStorage.getItem('ahribori_token');
            iFrame.contentWindow.postMessage(JSON.stringify({
                type: 'token',
                token
            }), '*');
        }
    });
}

/**
 * 커스텀 버튼을 클릭해서 만들어진 팝업창에서
 * postMessageAPI로 전송한 메세지를 받는 이벤트리스너를 바인딩
 */
export function bindLoginMessageEventLister() {
    window.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'onlogin') {
            const successCallback = window.AHRIBORI_AUTH_SDK.callback.loginSuccess;
            const failCallback = window.AHRIBORI_AUTH_SDK.callback.loginFail;
            const alwaysCallback = window.AHRIBORI_AUTH_SDK.callback.loginAlways;
            if (message.success === true) {
                const successObject = {
                    success: message.success,
                    auth: message.auth
                };
                if (window.localStorage) {
                    localStorage.setItem('ahribori_token', message.auth.token);
                }
                if (successCallback && typeof successCallback === 'function') successCallback(successObject);
                if (alwaysCallback && typeof alwaysCallback === 'function') alwaysCallback(successObject);
            } else if (message.success === false) {
                const failObject = {
                    success: message.success,
                    error: message.error
                };
                if (failCallback && typeof failCallback === 'function') failCallback(failObject);
                if (alwaysCallback && typeof alwaysCallback === 'function') alwaysCallback(failObject);
            }
        }
    });
}
