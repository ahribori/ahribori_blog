import React from 'react';
import GoogleLogin from 'react-google-login';

class GoogleAuthentication extends React.Component {

    constructor(props) {
        super(props);
        this.handleGoogleSuccess = this.handleGoogleSuccess.bind(this);
        this.handleGoogleFailure = this.handleGoogleFailure.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleGoogleSuccess(response) {
        const social_id = response.profileObj.googleId;
        const nickname = response.profileObj.name;
        const thumbnail_image = response.profileObj.imageUrl;
        this.handleLogin('google', social_id, nickname, thumbnail_image);
    }

    handleGoogleFailure(error) {
        console.log(error);
    }

    handleLogin(account_type, social_id, nickname, thumbnail_image) {
        this.props.loginRequest(account_type, social_id, nickname, thumbnail_image);
    }

    render() {
        return (
            <GoogleLogin
                clientId={process.env.GOOGLE_KEY}
                buttonText="구글 계정으로 로그인"
                onSuccess={this.handleGoogleSuccess}
                onFailure={this.handleGoogleFailure}
                className="google_login_btn_block"
            />
        );
    }
}

export default GoogleAuthentication;