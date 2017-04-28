/* eslint-disable class-methods-use-this */
import {
    initializeSDK
} from './requests';

import {
    validateCreateLoginButtonParameters,
    validateLoginParameters,
    bindCreateLoginButtonCallback,
    bindLoginCallback,
    bindCreateLoginButtonMessageEventLister,
    bindLoginMessageEventLister
} from './helpers';

/**
 * Ahribori 인증 소프트웨어 개발 도구
 * @class
 * @param {string} AHRIBORI_APPLICATION_KEY Ahribori 발급받은 어플리케이션 키
 */
window.AHRIBORI_AUTH_SDK =
class Auth {

    constructor(applicationKey) {
        initializeSDK(applicationKey).then((success) => {
            Object.defineProperties(window.AHRIBORI_AUTH_SDK, {
                initialized: {
                    value: success,
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
            });
        });
        this.applicationKey = applicationKey;
        this.containers = [];
        this.createLoginButton = this.createLoginButton.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getAppKey = this.getAppKey.bind(this);
        this.clean = this.clean.bind(this);
        window.AHRIBORI_AUTH_SDK = this;
    }

    waitInitialize(callback) {
        if (window.AHRIBORI_AUTH_SDK.initialized === true) {
            if (typeof callback === 'function') {
                callback();
            }
        } else if (window.AHRIBORI_AUTH_SDK.initialized === false) {
            console.error('[AHRIBORI_AUTH_SDK] AHRIBORI_AUTH_SDK가 초기화 되지 않아 API를 호출할 수 없습니다');
        } else {
            const wait = setInterval(() => {
                if (window.AHRIBORI_AUTH_SDK.initialized !== undefined) {
                    clearInterval(wait);
                    if (window.AHRIBORI_AUTH_SDK.initialized === true) {
                        if (typeof callback === 'function') {
                            callback();
                        } else {
                            console.error('[AHRIBORI_AUTH_SDK] callback은 function이어야 합니다');
                        }
                    } else {
                        console.error('[AHRIBORI_AUTH_SDK] AHRIBORI_AUTH_SDK가 초기화 되지 않아 API를 호출할 수 없습니다');
                    }
                }
            }, 100);
        }
    }

    /**
     * 컨테이너에 AHRIBORI 로그인 버튼을 만들어준다.
     *
     * @example
     * var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * ahriboriAuth.createLoginButton({
     *     container: '#YOUR DIV ID',
     *     size: 'small',
     *     success: function(authObject) {
     *
     *     },
     *     fail: function(errorObject) {
     *
     *     },
     *     always: function(authOrErrorObject) {
     *
     *     }
     * });
     *
     * @param settings {Object} 로그인 버튼을 생성하기 위한 설정
     * @param settings.container {string} 로그인버튼이 삽입될 컨테이너 셀렉터
     * @param settings.size {string} 삽입할 버튼의 사이즈 (small | medium | large)
     * @param settings.success {function} 로그인 성공 콜백 함수
     * @param settings.fail {function} 로그인 실패 콜백 함수
     * @param settings.always {function} 성공 실패 유무에 관계없는 콜백
     */
    createLoginButton({ container, size = 'medium', success, fail, always }) {
        this.waitInitialize(() => {
            if (validateCreateLoginButtonParameters({ container, size, success, fail, always })) {
                this.containers.push(container);
                const frame = `<iframe src="${process.env.SERVER_URL}/auth/createLoginButton?size=${size}" />`;
                document.querySelector(container).innerHTML = frame;
                const $frame = document.querySelector(`${container} > iframe`);
                $frame.style.border = 0;
                $frame.width = 0;
                $frame.height = 0;
                bindCreateLoginButtonCallback({ success, fail, always });
                bindCreateLoginButtonMessageEventLister({ container });
            }
        });
    }

    /**
     * 직접 만든 버튼에 AHRIBORI 로그인 기능을 바인딩 시킨다.
     *
     * @example
     * var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * ahriboriAuth.login({
     *     button: '#YOUR BUTTON ID',
     *     success: function(authObject) {
     *
     *     },
     *     fail: function(errorObject) {
     *
     *     },
     *     always: function(authOrErrorObject) {
     *
     *     }
     * });
     *
     * @param settings {object} 로그인 기능을 바인딩 하기 위한 설정
     * @param settings.target {string} 로그인 버튼 셀렉터
     * @param settings.success {function} 로그인 성공 콜백 함수
     * @param settings.fail {function} 로그인 실패 콜백 함수
     * @param settings.always {function} 성공 실패 유무에 관계없는 콜백
     */
    login({ target, success, fail, always }) {
        this.waitInitialize(() => {
            if (validateLoginParameters({ target, success, fail, always })) {
                this.containers.push(target);
                document.querySelector(target).onclick = function () {
                    const popup = window.open(`${process.env.SERVER_URL}/?continue=`, 'targetWindow',
                        'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=no, width=360, height=370');
                    window.addEventListener('message', (event) => {
                        const message = JSON.parse(event.data);
                        if (message.type === 'popupOnload') {
                            const token = localStorage.getItem('ahribori_token');
                            popup.postMessage({
                                type: 'token',
                                token
                            }, '*');
                        }
                    });
                };
                bindLoginCallback({ success, fail, always });
                bindLoginMessageEventLister();
            }
        });
    }

    /**
     * 로그아웃
     *
     * @example
     * var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * ahriboriAuth.logout();
     */
    logout() {
        this.waitInitialize(() => {
            if (window.localStorage) {
                const token = localStorage.getItem('ahribori_token');
                if (token) {
                    localStorage.removeItem('ahribori_token');
                }
            }
        });
    }

    /**
     * 현재 사용중인 토큰을 반환
     *
     * @example
     * var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * ahriboriAuth.getToken();
     */
    getToken() {
        this.waitInitialize(() => {
            if (window.localStorage) {
                const token = localStorage.getItem('ahribori_token');
                return token;
            }
            console.error('브라우저가 localStorage를 지원하지 않습니다. 최신 브라우저를 사용하세요.');
            return null;
        });
    }

    /**
     * 현재 사용중인 Application key 반환
     *
     * @example
     * var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * ahriboriAuth.getAppKey();
     */
    getAppKey() {
        this.waitInitialize(() => this.applicationKey);
    }

    /**
     * 리소스를 모두 해제
     * 컨테이너에 삽입된 DOM,
     * DOM에 바인딩 된 이벤트리스너,
     * AHRIBORI SDK Object를 삭제
     *
     * @example
     * var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * ahriboriAuth.clean();
     */
    clean() {
        const listeners = window.getEventListeners ? window.getEventListeners(window) : null;
        if (listeners && listeners.message) {
            const messageEventListeners = listeners.message;
            for (let i = 0; i < messageEventListeners.length; i++) {
                removeEventListener('message', messageEventListeners[i].listener);
            }
        }
        if (this.containers.length > 0) {
            for (let i = 0; i < this.containers.length; i++) {
                const dom = document.querySelector(this.containers[i]);
                if (dom.remove) {
                    dom.remove();
                } else if (dom && dom.parentNode) {
                    dom.parentNode.removeChild(dom);
                }
            }
        }
        delete window.AHRIBORI_AUTH_SDK;
    }
};
