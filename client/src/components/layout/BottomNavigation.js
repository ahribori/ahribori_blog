import React, { Component, PropTypes } from 'react';
import {BottomNavigation as Navigation, BottomNavigationItem as Item} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import HomeIcon from 'material-ui/svg-icons/action/home';
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import DownIcon from 'material-ui/svg-icons/editor/vertical-align-bottom';
import { browserHistory } from 'react-router';

class BottomNavigation extends React.Component {

    constructor(props) {
        super(props);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleGoHome = this.handleGoHome.bind(this);
        this.handleScrollBottom = this.handleScrollBottom.bind(this);
    }

    handleGoBack(e) {
        e.preventDefault();
        history.go(-1);
    }

    handleGoHome(e) {
        e.preventDefault();
        browserHistory.push('/');
    }

    handleScrollBottom(e) {
        e.preventDefault();
        document.querySelector('.mdl-layout__content').scrollTop = 10000 * 10000;

    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="bottom_navigation">
                <Paper zDepth={1}>
                    <Navigation>
                        <Item
                            label="뒤로가기"
                            icon={<BackIcon/>}
                            onTouchTap={this.handleGoBack}
                        />
                        <Item
                            label="홈"
                            icon={<HomeIcon/>}
                            onTouchTap={this.handleGoHome}
                        />
                        <Item
                            label="맨 아래로"
                            icon={<DownIcon/>}
                            onTouchTap={this.handleScrollBottom}
                        />
                    </Navigation>
                </Paper>
            </div>
        );
    }
}

export default BottomNavigation;