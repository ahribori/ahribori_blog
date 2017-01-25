import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';

const propTypes = {};

const defaultProps = {};

class Posts extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<Grid className="demo-grid-3">
					<Cell col={4} phone={6}>
						<Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</Cell>
					<Cell col={4} phone={6}>
						<Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</Cell>
					<Cell col={4} phone={6}>
						<Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</Cell>
					<Cell col={4} phone={6}>
						<Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</Cell>
				</Grid>
			</div>
		);
	}
}

Posts.propTypes = propTypes;

Posts.defaultProps = defaultProps;

const mapStateToProps = (state) => {
	return {
		status: state.authentication.register.status,
		error: state.authentication.register.error
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		registerRequest: (id, pw) => {
			return dispatch(registerRequest(id, pw));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);