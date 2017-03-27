import React from 'react';
import FacebookLogin from 'react-facebook-login';

class FacebookAuthentication extends React.Component {

    constructor(props) {
        super(props);
        this.handleFacebookResponse = this.handleFacebookResponse.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleFacebookResponse(response) {
        const social_id = response.id;
        const nickname = response.name;
        const thumbnail_image = response.picture.data.url;
        this.handleLogin('facebook', social_id, nickname, thumbnail_image);
    }

    handleLogin(account_type, social_id, nickname, thumbnail_image) {
        this.props.loginRequest(account_type, social_id, nickname, thumbnail_image);
    }

    render() {
        return (
            <FacebookLogin
                appId={process.env.FACEBOOK_KEY}
                autoLoad={false}
                fields="name,email,picture"
                textButton="페이스북 계정으로 로그인"
                cssClass="facebook_login_btn_block"
                language="ko_KR"
                callback={this.handleFacebookResponse} />
        );
    }
}

export default FacebookAuthentication;