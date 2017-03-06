import React, { Component, PropTypes } from 'react';
import {Grid, Cell, Card, CardActions, Button, Textfield, Icon, Snackbar} from 'react-mdl';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import { CKEditor } from 'components';
import { getCategoryRequest } from 'actions/category';
import { getStatusRequest } from 'actions/authentication';
import {
	registerArticleRequest,
	modifyArticleRequest,
	registerArticleTempRequest,
	getArticleTempRequest,
	modifyArticleTempRequest,
	getArticleRequest,
    removeArticleRequest
} from 'actions/article';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';
import config from '../config';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'register',
			categories: [],
			category: '',
			title: '',
			content: '',
			hidden: false,
			savedMessageActive: false
		};
		this.handleChangeCategory = this.handleChangeCategory.bind(this);
		this.handleChangeTitle = this.handleChangeTitle.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
		this.handleChangeCKEditor = this.handleChangeCKEditor.bind(this);
		this.handleSaveTemp = this.handleSaveTemp.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChangeCategory (event, index, value) {
		this.setState({
			category: value
		})
	}

	handleChangeTitle(e) {
		this.setState({
			title: e.target.value
		})
	}

	handleCheck() {
		this.setState({
			hidden: !this.state.hidden
		});
	}

	handleChangeCKEditor(content) {
		this.setState({
			content
		});
	}

	handleSaveTemp() {
		let article_temp = this.state;
		if (this.props.article_temp._id) {
			article_temp._id = this.props.article_temp._id;
			this.props.modifyArticleTempRequest(this.props.user.token, article_temp)
				.then(() => {
					if(this.props.modify_temp.status === 'SUCCESS') {
						this.setState({
							savedMessageActive: true
						})
					}
				})
		}
	}

	handleSubmit() {
		const content = CKEDITOR.instances['ck_editor'].getData();
		const preview = CKEDITOR.instances['ck_editor'].document.getBody().getText().substr(0, 150) + '...';
		let article = {
			category: this.state.category,
			author_id: this.props.user._id,
			author_nickname: this.props.user.nickname,
			title: this.state.title,
			content,
			preview,
			hidden: this.state.hidden,
		};

        const params = this.props.location.query;
		if (params.mode === 'modify') {
			article._id = this.props.article._id;
			this.props.modifyArticleRequest(this.props.user.token, article)
				.then(() => {
                    browserHistory.push('/article/' + this.props.article._id);
				});
		} else {
			article.article_temp_id = localStorage.getItem('article_temp_id');
			this.props.registerArticleRequest(this.props.user.token, article)
				.then(() => {
					localStorage.removeItem('write_state');
					browserHistory.push('/');
				});
			}
	}

	render() {
		const renderCategories = (list) => {
			return list.map((category, index) => {
				return (
					<MenuItem key={index} value={category._id} primaryText={category.name} />
				);
			})
		};

		return (
			<div>
				<Grid className="write_grid">
					<Cell offsetDesktop={2} col={8} phone={12} tablet={12} style={{ minWidth: '300px' }}>
						<Card shadow={0} style={{
							width: '100%'
						}}>
							<div style={{ padding: '20px' }}>
								<SelectField
									floatingLabelText="카테고리"
									fullWidth={true}
									value={this.state.category}
									onChange={this.handleChangeCategory}
									floatingLabelFixed={false}
								>
									{renderCategories(this.state.categories)}
								</SelectField>
								<Textfield
									name="title"
									value={this.state.title}
									onChange={this.handleChangeTitle}
									label="제목"
									floatingLabel
									style={{
										width: '100%'
									}}
								/>
								<Checkbox
									checked={!this.state.hidden}
									checkedIcon={<Visibility />}
									uncheckedIcon={<VisibilityOff />}
									onCheck={this.handleCheck}
									label={this.state.hidden ? '이 게시물을 나만 볼 수 있습니다' : '이 게시물을 모두가 볼 수 있습니다'}
								/>
							</div>
							<CKEditor id="editor" value={this.state.content} onChange={this.handleChangeCKEditor} />
							<CardActions border>
								{ this.state.mode === 'register' ? 
									<Button raised colored ripple onClick={this.handleSubmit}><Icon name="done"/> 등록</Button> :
									<Button raised accent ripple onClick={this.handleSubmit}><Icon name="edit"/> 수정</Button>
                                }
								{ this.state.mode === 'register' ? <Button ripple onClick={this.handleSaveTemp}><Icon name="save" />저장</Button> : '' }
								<Button ripple onClick={browserHistory.goBack}>취소</Button>
							</CardActions>
						</Card>
					</Cell>
				</Grid>
				<Snackbar
					active={this.state.savedMessageActive}
					onTimeout={() => {
						this.setState({ savedMessageActive: false })
					}}
					timeout={700}
					// action="Undo"
				>임시 저장되었습니다</Snackbar>
			</div>
		);
	}

	componentDidMount() {

		const params = this.props.location.query;
		const token = localStorage.getItem('ahribori_token');

		this.props.getStatusRequest(token)
			.then(() => {

				// 권한 없을 때 redirect
				if (!this.props.user || !this.props.user.admin) {
					browserHistory.push('/');
					return;
				}

				const article_temp = {
					category: this.state.category,
					author_id: this.props.user._id,
					author_nickname: this.props.user.nickname,
					title: this.state.title,
					content: this.state.content,
					hidden: this.state.hidden
				};

				const editor =  CKEDITOR.instances['ck_editor'];

				this.props.getCategoryRequest(this.props.user.token)
					.then(() => {
						if (this.props.category.status === 'SUCCESS') {
							this.setState({
								categories: this.props.category.response.response
							});
						}
					});

                if (params.mode === 'modify') {
					/*	MODIFY */
					this.setState({ mode: 'modify' });
					localStorage.setItem('editor_mode', 'modify');
					const id = params.id;

					if (this.props.article._id) { // props에 article이 있을 때
						this.setState(this.props.article);
						localStorage.setItem('article_id', this.props.article._id);
                        editor.on('instanceReady', () => {
                        	editor.setData(this.props.article.content);
                        });

					} else { // 새로고침하거나 url로 직접 접근해서 props에 article이 없을 때
						this.props.getArticleRequest(id, this.props.user.token)
							.then(() => {
                                this.setState(this.props.article);
								localStorage.setItem('article_id', this.props.article._id);

                                editor.on('instanceReady', () => {
                                    editor.setData(this.props.article.content);
                                });
							})
					}

                } else {
					/*	REGISTER */
                    this.setState({ mode: 'register' });
                    localStorage.setItem('editor_mode', 'register');

                    this.props.registerArticleTempRequest(token, article_temp)
                        .then(() => {
                            this.props.getArticleTempRequest(token)
                                .then(() => { //---------------- article_temp exist
                                    localStorage.setItem('article_temp_id', this.props.article_temp._id);
                                    if (this.props.article_temp.content !== '') {
                                        if (confirm('작성중이던 글이 있습니다. 이어서 작성하시겠습니까?')) {
                                            this.setState({
                                                category: this.props.article_temp.category,
                                                title: this.props.article_temp.title,
                                                content: this.props.article_temp.content
                                            });
                                            CKEDITOR.instances['ck_editor'].setData(this.props.article_temp.content);
                                        } else {
                                        	axios({
                                        		method: 'delete',
												url: `${config.API_SERVER}/api/article_temp/clear_images/${this.props.article_temp._id}`,
                                                headers: {
                                                    'authorization': token
                                                }
											})
												.then((response) => {
                                        			console.log(response, 'temp에 저장되어있던 이미지 모두 삭제 완료.');
													this.handleSaveTemp();
												})
												.catch((error) => {
													console.error(error);
												})
										}
                                    }
                                })
                        });

					clearInterval(this.saveTemp);
					this.saveTemp = setInterval(this.handleSaveTemp, 10000);

                } // register or modify

			}); // getStatusRequest

		// this.props.router.setRouteLeaveHook(this.props.route, () => {
		// 	if (this.props.register.status !== 'SUCCESS') {
		// 		return '이 페이지를 나가면 현재 작성 중인 글은 저장되지 않을 수 있습니다.';
		// 	}
		// });

	} // componentDidMount

	componentWillUnmount() {
		clearInterval(this.saveTemp);
		const cke_notifications = document.getElementsByClassName('cke_notifications_area');
		for (let i = 0; i < cke_notifications.length; i++) {
			cke_notifications[0].remove();
		}
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authentication.user,
		register: state.article.register,
		register_temp: state.article.register_temp,
		modify_temp: state.article.modify_temp,
		article_temp: state.article.article_temp.data,
		article: state.article.article.data,
		category: state.category.get
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getStatusRequest: (token) => {
			return dispatch(getStatusRequest(token));
		},
		registerArticleRequest: (token, article) => {
			return dispatch(registerArticleRequest(token, article));
		},
		modifyArticleRequest: (token, article) => {
            return dispatch(modifyArticleRequest(token, article));
		},
		registerArticleTempRequest: (token, article) => {
			return dispatch(registerArticleTempRequest(token, article))
		},
		modifyArticleTempRequest: (token, article_temp) => {
			return dispatch(modifyArticleTempRequest(token, article_temp))
		},
		getArticleTempRequest: (token) => {
			return (dispatch(getArticleTempRequest(token)))
		},
        getArticleRequest: (id, token) => {
            return dispatch(getArticleRequest(id, token));
        },
        removeArticleRequest: (token, id) => {
            return dispatch(removeArticleRequest(token, id));
		},
        getCategoryRequest: (token) => {
			return dispatch(getCategoryRequest(token));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Editor));