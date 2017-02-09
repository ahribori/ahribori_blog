import express from 'express';
const router = express.Router();
import config from '../config';
import path from 'path';
import fs from 'fs';
import Image from '../models/image';

const publicPath = path.resolve(__dirname, '../../public');
const imagePath = path.resolve(__dirname, '../../public/image');

if(!fs.existsSync(publicPath)) {
	fs.mkdirSync(publicPath);
}

if (!fs.existsSync(imagePath)) {
	fs.mkdirSync(imagePath);
}

/* =========================================
 POST /image
 {
 }
 ============================================*/
import multiparty from 'multiparty';
router.post('/ckeditor_dragndrop', (req, res) => {

	let form = new multiparty.Form({
		autoFiles: true,
		uploadDir: imagePath,
		maxFilesSize: 1024 * 1024 * 5
	});

	const parse = () => {
		return new Promise((resolve, reject) => {
			form.parse(req, (error, fields, files) => {
				if (error) {
					reject(error);
				} else {
					/*
					 원래 파일은 배열로 올라올 수 있기 때문에, 루프 처리를 해야 하지만
					 CKEditor Drag & Drop 기능은 파일을 여러개를 한꺼번에 올려도
					 하나의 Request에 여러 파일이 올라오는 방식이 아니라,
					 여러번의 Request를 날리는 방식이기 때문에 따로 처리를 하지 않았다.
					 */
					resolve(files.upload[0])
				}
			});
		});
	};

	const process = (file) => {
		return new Promise((resolve, reject) => {
			file.savedFilename = path.basename(file.path);
			resolve(file);
		});
	};

	const save = (file) => {
		return new Promise((resolve, reject) => {
			Image.create(file.originalFilename, file.savedFilename, file.path, file.size)
				.then(resolve(file.savedFilename))
		})
	};

	const respond = (fileName) => {
		res.json({
			uploaded: 1,
			fileName: fileName,
			url: config.API_SERVER +'/image/' + fileName
		});
	};

	const onError = (error) => {
		res.json({
			uploaded: 0,
			error: {
				message: error.message
			}
		})
	};

	parse()
		.then(process)
		.then(save)
		.then(respond)
		.catch(onError)

});

export default router;