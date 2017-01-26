import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Drawer, Navigation} from 'react-mdl';

class Sidebar extends React.Component {

	constructor(props) {
		super(props);
		this.handleToggle = this.handleToggle.bind(this);
	}

	handleToggle() {
		const layout = document.querySelector('.mdl-layout');
		const obfuscator = document.querySelector('.mdl-layout__obfuscator');
		const obfuscatorEnabled = obfuscator.classList[1];
		if (obfuscatorEnabled) {
			layout.MaterialLayout.toggleDrawer();
		}
	}

	render() {
		return (
			<Drawer
				// title="Menu"
			>
				<Navigation>
					<Link to="/" onClick={this.handleToggle}>Home</Link>
				</Navigation>
			</Drawer>
		);
	}
}

export default Sidebar;