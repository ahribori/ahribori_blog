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

        CKEDITOR.instances[this.elementName].on('fileUploadRequest', function (evt) {
            const fileLoader = evt.data.fileLoader;
            const formData = new FormData();
            const xhr = fileLoader.xhr;
            const mode = localStorage.getItem("editor_mode");

            xhr.open('POST', fileLoader.uploadUrl, true);
            formData.append('upload', fileLoader.file, fileLoader.fileName);
            formData.append('mode', mode);
            (mode === 'modify') ?
                formData.append("article_id", localStorage.getItem("article_id")) :
                formData.append("article_temp_id", localStorage.getItem("article_temp_id"));

            fileLoader.xhr.send(formData);
            evt.stop();
        });

		CKEDITOR.instances[this.elementName].on( 'fileUploadResponse', function( evt ) {
		} );
	}
}