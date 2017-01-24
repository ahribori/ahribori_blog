import React, {Component, PropTypes} from 'react';
import { Navigation, Sidebar } from 'components';
import { Layout, Content } from 'react-mdl';
import { connect } from 'react-redux';
import { toggleSidebar } from 'actions/application';
import { getStatusRequest } from 'actions/authentication';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<Layout fixedHeader fixedDrawer>
					<Navigation />
					<Sidebar />
					<Content>
						<div style={{margin: 'auto'}}>
							{this.props.children}
						</div>
					</Content>
				</Layout>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		sidebar: state.application.sidebar,
		status: state.authentication.status
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getStatusRequest: () => {
			return dispatch(getStatusRequest());
		},
		toggleSidebar: () => {
			return dispatch(toggleSidebar());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);