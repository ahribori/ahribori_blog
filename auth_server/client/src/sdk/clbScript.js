let status = 'LOGIN';

window.onload = () => {
	var loginButton = document.querySelector('#ahriboriLoginButton');
	window.parent.postMessage(JSON.stringify({
		type: 'createButtonOnload',
		style: {
			width: loginButton.offsetWidth,
			height: loginButton.offsetHeight
		}
	}), '*');

	window.addEventListener('message', (event) => {
		var message = JSON.parse(event.data);
		if (message.type === 'checkTokenValid') {
			// 클라이언트에 저장되어있는 토큰이 유효한 토큰이면
			if (message.success) {
				setButtonLogout();
			} else {
				setButtonLogin();
			}
		}
	});
};

window.passResponse = (response) => {
	response.type = 'oncreatebuttonlogin';
	window.parent.postMessage(JSON.stringify(response), "*");
	if (response.success) {
		setButtonLogout();
	}
};

/**
 * 로그인 팝업창 띄우는 함수
 */
let messageEventListenerBinded = false;
const openLoginPopup = function () {
	window.parent.postMessage(JSON.stringify({
		type: 'getToken'
	}), '*');

	let popup;
	let token;
	const continueURL = encodeURIComponent('{{{continue}}}');
	// 3rd에 token 있을 때 넘어오는 token을 listen
	if (!messageEventListenerBinded) {
		window.addEventListener('message', function (event) {
			const message = JSON.parse(event.data);
			if (message.type === 'token') {
				token = message.token;
				popup = window.open('/?clb=1&continue=' + continueURL, 'targetWindow',
					'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=no, width=360, height=370');
			} else if (message.type === 'popupOnload') {
				popup.postMessage({
					type: 'token',
					token: token
				}, '*');
			}
		});
		messageEventListenerBinded = true;
	}
};

/**
 * 버튼을 로그인 버튼으로 변경한다
 */
const setButtonLogin = () => {
	const button = document.getElementById('ahriboriLoginButton');
	button.innerHTML = '<i class="privacy icon"></i>로그인';
	status = 'LOGIN';
};

/**
 * 버튼을 로그아웃 버튼으로 변경한다
 */
const setButtonLogout = () => {
	const button = document.getElementById('ahriboriLoginButton');
	button.innerText = '로그아웃';
	status = 'LOGOUT';
};

/**
 * sdk에 logout 신호를 보낸다
 */
const logout = () => {
	window.parent.postMessage(JSON.stringify({
		type: 'logout'
	}), '*');
	setButtonLogin();
};

/**
 * 버튼 onclick 이벤트
 */
document.getElementById('ahriboriLoginButton').onclick = () => {
	if (status === 'LOGIN') {
		openLoginPopup();
	} else if (status === 'LOGOUT') {
		setButtonLogout();
		logout();
	}
};