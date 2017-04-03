import React, { Component } from 'react';
import {
    ShareButtons,
    ShareCounts,
    generateShareIcon,
} from 'react-share';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} = ShareButtons;

const {
    FacebookShareCount,
    GooglePlusShareCount,
    LinkedinShareCount,
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');

class Share extends React.Component {

    constructor(props) {
        super(props);
        this.state = { ... props }
    }

    componentDidMount() {
        console.log(this.state);
    }

    render() {
        return (
            <div className="share_btn_group">
                <span className="share_btn_group_title">이 글 공유하기</span>
                <div className="article_share_network">
                    <FacebookShareButton url={this.state.url} description={this.state.description} title={this.state.title} picture={this.state.picture}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </div>
                <div className="article_share_network">
                    <GooglePlusShareButton url={this.state.url}>
                        <GooglePlusIcon size={32} round />
                    </GooglePlusShareButton>
                </div>
                <div className="article_share_network">
                    <LinkedinShareButton url={this.state.url} description={this.state.description} title={this.state.title}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
                <div className="article_share_network">
                    <TwitterShareButton url={this.state.url} title={this.state.title}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </div>
            </div>
        );
    }
}

export default Share;