import React, { Component, PropTypes } from 'react';
import {Grid, Cell, Card, CardActions, Button, Textfield, Icon} from 'react-mdl';
import { withRouter } from 'react-router';
import { CKEditor } from 'components';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Write extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			category: 0,
			title: '',
			content: ''
		};
		this.handleChangeCategory = this.handleChangeCategory.bind(this);
		this.handleChangeTitle = this.handleChangeTitle.bind(this);
		this.handleChangeCKEditor = this.handleChangeCKEditor.bind(this);
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

	handleChangeCKEditor(content) {
		this.setState({
			content
		});
	}

	handleSubmit() {
		console.log(this.state)
	}

	render() {

		return (
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
						</div>
						<CKEditor id="editor" value={this.state.content} onChange={this.handleChangeCKEditor} />
						<CardActions border>
							<Button raised colored ripple onClick={this.handleSubmit}><Icon name="done" />등록</Button>
							<Button ripple>취소</Button>
						</CardActions>
					</Card>
				</Cell>
			</Grid>
		);
	}

	componentDidMount() {
		clearInterval(this.saveState);
		this.savedState = localStorage.getItem('write_state');
		if (this.savedState) {
			this.savedState = JSON.parse(this.savedState);
			if (confirm('작성중이던 글이 있습니다. 이어서 작성하시겠습니까?')) {
				this.setState(this.savedState);
			} else {
				localStorage.removeItem('write_state');
			}
		}

		this.saveState = setInterval(() => {
			if (this.state.content !== '') {
				localStorage.setItem('write_state', JSON.stringify(this.state));
			} else {
				localStorage.removeItem('write_state');
			}
		}, 5000);

		this.props.router.setRouteLeaveHook(this.props.route, () => {
			return '이 페이지를 나가면 현재 작성 중인 글은 저장되지 않을 수 있습니다.';
		});
	}

	componentWillUnmount() {
		clearInterval(this.saveState);
		const cke_notifications = document.getElementsByClassName('cke_notifications_area');
		for (let i = 0; i < cke_notifications.length; i++) {
			cke_notifications[0].remove();
		}
	}
}

export default withRouter(Write);