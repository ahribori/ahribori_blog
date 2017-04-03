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
        this.state = {
            url: props.url
        }
    }

    render() {
        return (
            <div className="share_btn_group">
                <div className="article_share_network">
                    <FacebookShareButton url={this.state.url}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </div>
                <div className="article_share_network">
                    <GooglePlusShareButton url={this.state.url}>
                        <GooglePlusIcon size={32} round />
                    </GooglePlusShareButton>
                </div>
                <div className="article_share_network">
                    <LinkedinShareButton url={this.state.url}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
                <div className="article_share_network">
                    <TwitterShareButton url={this.state.url}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </div>
            </div>
        );
    }
}

export default Share;