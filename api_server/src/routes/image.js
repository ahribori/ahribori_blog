require('dotenv').config();
const env = process.env;
import express from 'express';
const router = express.Router();
import path from 'path';
import fs from 'fs';
import Image from '../models/image';
import Article from '../models/article';
import ArticleTemp from '../models/article_temp';
import Jimp from 'jimp';

const publicPath = path.resolve(__dirname, '../../public');
const imagePath = (env.IMAGE_REPOSITORY && env.IMAGE_REPOSITORY !== '') ?
	path.resolve(env.IMAGE_REPOSITORY) : path.join(publicPath, '/image');

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
	const MAX_FILE_SIZE = env.MAX_IMAGE_SIZE * 1024 * 1024;

	let form = new multiparty.Form({
		autoFiles: true,
		uploadDir: imagePath,
		maxFilesSize: MAX_FILE_SIZE
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

					const mode = fields.mode[0];

					if (mode === 'register') {
						resolve({
							mode: fields.mode[0],
							article_temp_id: fields.article_temp_id[0],
							file: files.upload[0]
						})
					} else if (mode === 'modify') {
						resolve({
							mode: fields.mode[0],
							article_id: fields.article_id[0],
							file: files.upload[0]
						})
					}
				}
			});
		});
	};

	const process = (result) => {
		return new Promise((resolve, reject) => {
			const file_path = result.file.path;

			//********** Jimp Imeage Processing **********
			Jimp.read(file_path, (err, image) => {
				if (err) {
					fs.unlink(file_path);
					reject({ message: '이미지 파일이 완전하지 않습니다.' });
				}

                /**
				 * MAX_IMAGE_WIDTH로 리사이징
                 */
				// try {
				// 	if (image.bitmap.width > env.MAX_IMAGE_WIDTH) image.resize(env.MAX_IMAGE_WIDTH, Jimp.AUTO);
				// 	image.quality(100);
				// } catch(e) {
				// 	console.error(e);
				// }

                /**
				 * 이미지 워터마크
                 */
				// Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (font) {
				// 	const fontWidth = image.bitmap.width - 130;
				// 	const fontHeight = image.bitmap.height - 25;
				// 	image.print(font, fontWidth, fontHeight, "AHRIBORI.COM");
				// });

				image.write(file_path);
				result.file.savedFilename = path.basename(file_path);
				resolve({
					mode: result.mode,
					article_id: result.article_id,
					article_temp_id: result.article_temp_id,
					file: result.file
				});
			});
		});
	};

	const save = (result) => {
		return new Promise((resolve, reject) => {
			Image.create(result.file.originalFilename, result.file.savedFilename, result.file.path, result.file.size)
				.then((image) => {
					if (result.mode === 'register') {
						ArticleTemp.findById(result.article_temp_id, (err, article_temp) => {
							article_temp.images.push(image._id);
							article_temp.save((err) => {
								if (err) reject(err);
								else resolve(result.file.savedFilename);
							})
						});
					} else if (result.mode === 'modify') {
                        Article.findById(result.article_id, (err, article) => {
                            article.images.push(image._id);
                            article.save((err) => {
                                if (err) reject(err);
                                else resolve(result.file.savedFilename);
                            })
                        });
					}
				})
		})
	};

	const respond = (fileName) => {
		res.json({
			uploaded: 1,
			fileName: fileName,
			url: env.API_SERVER +'/image/' + fileName
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