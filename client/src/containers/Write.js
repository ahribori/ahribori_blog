import React, { Component, PropTypes } from 'react';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Icon} from 'react-mdl';

class Write extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<Grid>
				<Cell col={12} phone={12} tablet={12}>
					<Card shadow={0} className="big-item-card">
					</Card>
				</Cell>
			</Grid>
		);
	}

	componentDidMount() {

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

}

export default Write;