import React, { Component } from 'react';

import {
    ShareButtons,
    ShareCounts,
    generateShareIcon,
} from 'react-share';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton,
} = ShareButtons;

const {
    FacebookShareCount,
    GooglePlusShareCount,
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');

class Share extends React.Component {

    constructor(props) {
        super(props);
        this.state = { ... props }
        this.shareKakaoStory = this.shareKakaoStory.bind(this);
    }

    shareKakaoStory() {
        Kakao.Story.share({
            url: this.state.url,
            text: this.state.title
        })
    }

    componentDidMount() {
        if (!document.getElementById('kakao-sdk')) {
            ((d, s, id, cb) => {
                const element = d.getElementsByTagName(s)[0];
                const fjs = element;
                let js = element;
                js = d.createElement(s);
                js.id = id;
                js.src = '//developers.kakao.com/sdk/js/kakao.min.js';
                fjs.parentNode.insertBefore(js, fjs);
                js.onload = cb;
            })(document, 'script', 'kakao-sdk', () => {
                Kakao.init(process.env.KAKAO_KEY);
                Kakao.Link.createDefaultButton({
                    container: '#kakao_link_btn',
                    objectType: 'feed',
                    content: {
                        title: this.state.title,
                        imageUrl: this.state.picture,
                        link: {
                            webUrl: this.state.url
                        },
                        description: this.state.description
                    }
                });
            });
        }
    }

    render() {
        return (
            <div className="share_btn_group">
                <span className="share_btn_group_title">이 글 공유하기</span>
                <div className="article_share_network">
                    <div id="kakao_link_btn" className="kakao_share_btn">
                        <img src="/image/kakao_icon.png" height={32} width={32}/>
                    </div>
                </div>
                <div className="article_share_network">
                    <div id="kakaostory_link_btn" className="kakao_share_btn" onTouchTap={this.shareKakaoStory}>
                        <img src="/image/kakaostory_icon.png" height={32} width={32}/>
                    </div>
                </div>
                <div className="article_share_network">
                    <FacebookShareButton url={this.state.url} description={this.state.description} title={this.state.title} picture={this.state.picture}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </div>
                <div className="article_share_network">
                    <TwitterShareButton url={this.state.url} title={this.state.title}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </div>
                <div className="article_share_network">
                    <GooglePlusShareButton url={this.state.url}>
                        <GooglePlusIcon size={32} round />
                    </GooglePlusShareButton>
                </div>
            </div>
        );
    }
}

export default Share;