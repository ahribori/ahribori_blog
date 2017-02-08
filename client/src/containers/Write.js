import React, { Component, PropTypes } from 'react';
import {Grid, Cell, Card, Textfield} from 'react-mdl';
import { withRouter } from 'react-router';
import { CKEditor } from 'components';

class Write extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: ''
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(content) {
		this.setState({
			content
		});
	}

	render() {
		return (
			<Grid>
				<Cell col={12} phone={12} tablet={12}>
					<Card shadow={0} style={{
						width: '100%'
					}}>
						<div style={{ padding: '20px' }}>
							<Textfield
								name="title"
								value="123"
								label="제목"
								floatingLabel
								style={{
									width: '100%'
								}}
							/>
						</div>
						<CKEditor id="1" value={this.state.content} onChange={this.handleChange} />
						<div>{this.state.content}</div>
					</Card>
				</Cell>
			</Grid>
		);
	}

	componentDidMount() {
		this.props.router.setRouteLeaveHook(this.props.route, () => {
			return '이 페이지를 나가면 현재 작성 중인 글은 저장되지 않습니다';
		});
	}

	componentWillReceiveProps() {

	}

	shouldComponentUpdate() {
	    /*
		 props/state 변경시 rerendering 여부
		 true 반환시 render() 실행 후 componentWillUpdate 실행
		 */
		return true;
	}

	componentWillUpdate() {
	    // setState() 사용 금지
	}

	componentDidUpdate() {
	    // setState() 사용 금지
	}

	componentWillUnmount() {
		console.log('dd')
		this.props.router.setRouteLeaveHook(this.props.route, () => {
			return '이 페이지를 나가면 현재 작성 중인 글은 저장되지 않습니다';
		});
	}
}

export default withRouter(Write);