# Ahribori Authorization SDK

Ahribori Authorization SDK는 Ahribori 인증을 손쉽게 구현할 수 있는 개발 도구 입니다.

## Installation

웹 페이지에 sdk 스크립트를 삽입한 다음, Ahribori에서 발급받은 어플리케이션 키로 초기화합니다.
```html
<script type="text/javascript" src="https://auth.ahribori.com/sdk.js"></script>

<script>
    var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');
</script>
```

## Example

웹 페이지의 특정 div 엘리먼트에 Ahribori 로그인 버튼을 생성하는 예제입니다.
```html
<div id="ahribori-login"></div> // 로그인 버튼을 삽입할 엘리먼트

<script type="text/javascript" src="https://auth.ahribori.com/sdk.js"></script>

<script>
    var ahriboriAuth = new AHRIBORI_AUTH_SDK('YOUR_APPLICATION_KEY');

    ahriboriAuth.createLoginButton({
        container: '#ahribori-login',
        success: function(authObject) {
            // 로그인 성공 후처리
        },
        fail: function(errorObject) {
            // 로그인 실패 후처리
        }
    });
</script>
```