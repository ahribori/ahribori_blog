import React from 'react';
import KakaoLogin from 'react-kakao-login';

class KakaoAuthentication extends React.Component {

	constructor(props) {
		super(props);
		this.handleKakaoSuccess = this.handleKakaoSuccess.bind(this);
		this.handleKakaoError = this.handleKakaoError.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleKakaoSuccess(response) {
        Kakao.API.request({
            url: '/v1/api/talk/profile',
			success: (profile) => {
				const social_id = response.profile.id;
				const nickname = profile.nickName;
				const thumbnail_image = profile.thumbnailURL;
				this.handleLogin('kakao', social_id, nickname, thumbnail_image);
			}
		});
	}

	handleKakaoError(error) {
		console.log(error)
	}

	handleLogin(account_type, social_id, nickname, thumbnail_image) {
		this.props.loginRequest(account_type, social_id, nickname, thumbnail_image);
	}

	render() {
        return (
			<KakaoLogin
				jsKey={process.env.KAKAO_KEY}
				onSuccess={this.handleKakaoSuccess}
				onFailure={this.handleKakaoError}
				getProfile={true}
				buttonClass="kakao_login_btn_block"
				buttonText="카카오 계정으로 로그인"
			/>
        );
	}
}

export default KakaoAuthentication;