import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardText, CardActions, Button } from 'react-mdl';
import 'masonry-layout';

const propTypes = {};

const defaultProps = {};

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<div className="grid" style={{ padding: '8px'}} data-masonry='{ "columnWidth": 0, "itemSelector": ".grid-item" }'>

					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '320px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>
					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '420px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>
					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '320px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>
					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '320px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>
					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '320px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>
					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '720px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>
					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '420px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>
					<div className="grid-item" style={{ margin: '8px' }}>
						<Card shadow={0} style={{width: '320px', height: '520px'}}>
							<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.
							</CardText>
							<CardActions border>
								<Button colored>View Updates</Button>
							</CardActions>
						</Card>
					</div>

				</div>
			</div>
		);
	}
}

Home.propTypes = propTypes;

Home.defaultProps = defaultProps;

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);