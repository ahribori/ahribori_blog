/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'links' },
		{ name: 'paragraph',   groups: [ 'list', 'align'] },
		{ name: 'document'},
		{ name: 'tools' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'colors' },
		{ name: 'styles' },
		{ name: 'mode'}
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';

	// 파일 업로드 브라우저 주소
	config.filebrowserBrowseUrl = '';

	// 파일 업로드 주소
	config.filebrowserUploadUrl = '';

	// 드래그앤드롭 이미지 업로드 주소
	config.uploadUrl = 'http://localhost:3000/image/ckeditor_dragndrop';

	// 에디터 높이
	config.height = '320px';

	config.tabSpaces = 4;

	config.extraPlugins = 'image2';
	config.image2_alignClasses = [ 'image-left', 'image-center', 'image-right' ];
	config.image2_captionedClass = 'image-captioned';

    config.extraPlugins = 'autolink';
};
