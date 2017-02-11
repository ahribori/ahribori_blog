import React, { Component, PropTypes } from 'react';
import {Grid, Cell, Card, CardActions, Button, Textfield, Icon, Snackbar} from 'react-mdl';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import { CKEditor } from 'components';
import { getStatusRequest } from 'actions/authentication';
import { registerArticleRequest, registerArticleTempRequest, getArticleTempRequest, modifyArticleTempRequest } from 'actions/article';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Write extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			category: 0,
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
		article_temp._id = this.props.article_temp._id;
		this.props.modifyArticleTempRequest(this.props.user.token, article_temp)
			.then(() => {
				this.setState({
					savedMessageActive: true
				})
			})
	}

	handleSubmit() {
		const content = CKEDITOR.instances['ck_editor'].getData();
		const preview = CKEDITOR.instances['ck_editor'].document.getBody().getText().substr(0, 300) + '...';
		const article = {
			category: this.state.category,
			author: this.props.user._id,
			title: this.state.title,
			content,
			preview,
			hidden: this.state.hidden,
			article_temp_id: localStorage.getItem('article_temp_id')
		};

		this.props.registerArticleRequest(this.props.user.token, article)
			.then(() => {
				localStorage.removeItem('write_state');
				browserHistory.push('/');
			});
	}

	render() {

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
									<MenuItem value={1} primaryText="Never" />
									<MenuItem value={2} primaryText="Every Night" />
									<MenuItem value={3} primaryText="Weeknights" />
									<MenuItem value={4} primaryText="Weekends" />
									<MenuItem value={5} primaryText="Weekly" />
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
								<Button raised colored ripple onClick={this.handleSubmit}><Icon name="done" />등록</Button>
								<Button ripple onClick={this.handleSaveTemp}><Icon name="save" />저장</Button>
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
		const token = localStorage.getItem('ahribori_token');
		this.props.getStatusRequest(token)
			.then(() => {
				//---------------- user exist
				const article_temp = {
					category: this.state.category,
					author: this.props.user._id,
					title: this.state.title,
					content: this.state.content,
					hidden: this.state.hidden
				};

				this.props.registerArticleTempRequest(token, article_temp)
					.then(() => {
						console.log('************************************************REGISTER')
						this.props.getArticleTempRequest(token)
							.then(() => { //---------------- article_temp exist
								console.log('*************************************************GET를 가져왔고 id는 ' + this.props.article_temp._id);
								localStorage.setItem('article_temp_id', this.props.article_temp._id);
								if(this.props.article_temp.content !== '') {
									if (confirm('작성중이던 글이 있습니다. 이어서 작성하시겠습니까?')) {
										this.setState({
											category: this.props.article_temp.category,
											title: this.props.article_temp.title,
											content: this.props.article_temp.content
										});
										CKEDITOR.instances['ck_editor'].setData(this.props.article_temp.content);
									}
								}
							})
					})

			});

		clearInterval(this.saveTemp);
		this.saveTemp = setInterval(this.handleSaveTemp, 10000);

		// this.props.router.setRouteLeaveHook(this.props.route, () => {
		// 	if (this.props.register.status !== 'SUCCESS') {
		// 		return '이 페이지를 나가면 현재 작성 중인 글은 저장되지 않을 수 있습니다.';
		// 	}
		// });
	}

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
		article_temp: state.article.article_temp.data
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
		registerArticleTempRequest: (token, article) => {
			return dispatch(registerArticleTempRequest(token, article))
		},
		modifyArticleTempRequest: (token, article_temp) => {
			return dispatch(modifyArticleTempRequest(token, article_temp))
		},
		getArticleTempRequest: (token) => {
			return (dispatch(getArticleTempRequest(token)))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Write));