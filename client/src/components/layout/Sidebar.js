import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Drawer, Navigation} from 'react-mdl';
import Avatar from 'material-ui/Avatar';

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

		const thumbnailImage = () => {
			if (this.props.user && this.props.user.thumbnail_image) {
				return (
					<div style={{ margin: '0px auto', paddingTop: '10px' }}>
						<Avatar
							src={this.props.user ? this.props.user.thumbnail_image: ''}
							size={80}
						/>
					</div>
				);
			}
		};

		return (
			<Drawer
				title={this.props.user ? `${this.props.user.nickname}님, 접속중`  : ''}
			>
				{thumbnailImage()}
				<div className="sidebar_username">{this.props.user ? this.props.user.username : ''}</div>
				<Navigation>
					<Link to="/" onClick={this.handleToggle}>Home</Link>
				</Navigation>
			</Drawer>
		);
	}
}

export default Sidebar;