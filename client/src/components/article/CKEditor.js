import React, {Component} from "react";

export default class CKEditor extends Component {
	constructor(props) {
		super(props);
		this.elementName = "editor_" + this.props.id;
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	render() {
		return (
			<textarea name={this.elementName} defaultValue={this.props.value}/>
		)
	}

	componentDidMount() {
		let configuration = {
			toolbar: 'Basic',
			height: '450px',
			contentCss: ''
		};
		CKEDITOR.replace(this.elementName, configuration);
		CKEDITOR.instances[this.elementName].on("change", function () {
			let data = CKEDITOR.instances[this.elementName].getData();
			this.props.onChange(data);
		}.bind(this));
	}
}