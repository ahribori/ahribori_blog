import React from 'react';
import { Button, Checkbox, Form, Container } from 'semantic-ui-react';
import axios from 'axios';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasOpener: true,
            submitButtonLoading: false,
            submitButtonColor: 'violet',
            submitButtonText: '로그인'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const opener = window.opener;
        if (opener) {
            this.setState({
                hasOpener: true
            });
            window.opener.postMessage(JSON.stringify({
                type: 'popupOnload'
            }), '*');
            window.addEventListener('message', (event) => {
                const message = event.data;
                if (message.type === 'token') {
                    const token = message.token;
                    if (token) {
                        // TODO 토큰이 유효한지 검증
                        if (true) {
                            const isClb = /clb=1/.test(location.search);
                            const targetWindow = isClb ? window.opener.parent : window.opener;
                            targetWindow.postMessage(JSON.stringify({
                                success: true,
                                type: isClb ? 'oncreatebuttonlogin' : 'onlogin',
                                auth: {
                                    token // 로그인 성공한뒤 재발급 된 토큰을 내려주면 됨
                                }
                            }), '*');
                            window.close();
                        }
                    }
                }
            });
        }
    }

    handleSubmit(e) {
        this.setState({
            submitButtonLoading: true,
            submitButtonColor: 'violet'
        });
        const username = document.querySelector('input[name=username]').value;
        const password = document.querySelector('input[name=password]').value;

        /**
         * 로그인 요청!
         */
        axios({
            url: `/auth/login${location.search}`,
            method: 'post',
            data: {
                username,
                password
            }
        }).then((response) => {
            this.setState({
                submitButtonLoading: false,
                submitButtonText: '로그인'
            });
            const isClb = /clb=1/.test(location.search);
            const success = response.data.success;
            if (isClb) { // WEBAPM_AUTH_SDK.createLoginButton
                window.opener.passResponse(response.data);
                if (success) { /* 로그인 성공 */
                    window.close();
                } else { /* 로그인 실패 */
                    alert('접속 정보가 올바르지 않습니다.');
                }
            } else { // WEBAPM_AUTH_SDK.login
                response.data.type = 'onlogin';
                window.opener.postMessage(JSON.stringify(response.data), '*');
                if (success) { /* 로그인 성공 */
                    window.close();
                } else { /* 로그인 실패 */
                    alert('접속 정보가 올바르지 않습니다.');
                }
            }
        }).catch((error) => {
            this.setState({
                submitButtonLoading: false,
                submitButtonColor: 'red',
                submitButtonText: '문제가 발생했습니다!'
            });
            console.error(error);
        });
        e.preventDefault();
    }

    render() {
        const loginForm = () => {
            if (this.state.hasOpener) {
                return (
                    <div>
                        <div className="logo" style={{
                            height: '100px',
                            marginLeft: 'auto !important',
                            marginRight: 'auto !important',
                            color: 'white',
                            background: `pink url("/cats.png") no-repeat center`,
                            backgroundSize: '100px auto'
                        }} />
                        <Container className="wrapper">
                            <Form action={`/auth/login${location.search}`} method="post" onSubmit={this.handleSubmit} size="large">
                                <Form.Field>
                                    <input type="text" name="username" placeholder="계정" />
                                </Form.Field>
                                <Form.Field>
                                    <input type="password" name="password" placeholder="비밀번호" />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox label="아이디를 기억합니다" />
                                </Form.Field>
                                <Button
                                  type="submit"
                                  size="large"
                                  basic
                                  fluid color={this.state.submitButtonColor}
                                  loading={this.state.submitButtonLoading}
                                >{this.state.submitButtonText}</Button>
                            </Form>
                        </Container>
                    </div>
                );
            }
            return (
                <div
                  style={{
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      marginTop: '1rem',
                      color: 'red'
                  }}
                >비정상적인 접근입니다.</div>
            );
        };

        return loginForm();
    }
}

export default LoginForm;
