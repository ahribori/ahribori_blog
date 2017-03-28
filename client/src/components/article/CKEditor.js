import React, {Component} from "react";

export default class CKEditor extends Component {

	constructor(props) {
		super(props);
		this.elementName = "ck_" + this.props.id;
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	render() {
		return (
			<textarea name={this.elementName} value={this.props.value}/>
		)
	}

	componentDidMount() {
		CKEDITOR.replace(this.elementName);
		CKEDITOR.instances[this.elementName].on("change", function () {
			let data = CKEDITOR.instances[this.elementName].getData();
			this.props.onChange(data);
		}.bind(this));

        CKEDITOR.instances[this.elementName].on("instanceReady", function (evt) {
            if(typeof this.props.onReady === 'function') {
            	this.props.onReady(evt);
			}
        }.bind(this));

		CKEDITOR.instances[this.elementName].on( 'fileUploadRequest', function( evt ) {
		});

		CKEDITOR.instances[this.elementName].on( 'fileUploadResponse', function( evt ) {
		} );
	}
}