import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Article from '../models/article';
import ArticleTemp from '../models/article_temp';
import Image from '../models/image';
import jsdom from 'jsdom';
import fs from 'fs';
import config from '../config';

/* =========================================
 POST /api/article
 {
 category,
 author_id,
 author_nickname,
 title,
 content,
 hidden
 }
 ============================================*/
router.post('/', (req, res) => {
	
	const { category, author_id, author_nickname, title, content, preview, hidden, article_temp_id } = req.body;

	const validate = (category, author_id, author_nickname, title, content, preview, hidden) => {

		return new Promise((resolve, reject) => {

			if (!req.payload.admin) throw { message: 'not admin' };
			//TODO validate form

			resolve();
		})
	};

	const create = () => {
		return new Promise((resolve, reject) => {
			Article.create(category, author_id, author_nickname, title, content, preview, hidden)
				.then((article) => {
					ArticleTemp.aggregate([
						{
							$match: {
								_id: mongoose.Types.ObjectId(article_temp_id)
							}
						},
						{
							$lookup: {
								from: 'images',
								localField: 'images',
								foreignField: '_id',
								as: 'images'
							}
						}
					], (err, article_temp) => {
						article_temp = article_temp[0];

						// ** content에 있는 image와 실제 업로드된 image를 매칭시켜서
						// 실제 사용하는 image만 서버에 남겨둠
						jsdom.env(content, (err, window) => {
							const tempImages = article_temp.images;
							const images = window.document.images;
							let thumbnail_picked = false;
							for (let x = 0; x < tempImages.length; x++) {
								let exist = false;
								for (let i = 0; i < images.length; i++) {
									if (images[i].src.indexOf(tempImages[x].name) !== -1) {
										exist = true;
										break;
									}
								}
								if (exist) {
									article.images.push(tempImages[x]._id);
									if (!thumbnail_picked) {
										article.thumbnail_image = `${config.API_SERVER}/image/${tempImages[x].name}`;
										thumbnail_picked = true;
									}
								} else {
									fs.unlink(tempImages[x].real_path);
									Image.find({ _id: tempImages[x]._id }).remove().exec();
								}
							}
							ArticleTemp(article_temp).remove()
								.then(resolve(article.save()));
						});
						//-----------------------------------------------------------

					});
				});
		});
	};

	const respond = () => {
		res.sendStatus(200);
	};

	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	};

	validate(category, author_id, author_nickname, title, content, hidden)
		.then(create)
		.then(respond)
		.catch(onError);

});

/* =========================================
 GET /api/article?offset={offset}&limit={limit}
 ============================================*/
router.get('/', (req, res) => {
	let { offset = 0, limit = 10 } = req.query;
	offset = Number(offset);
	limit = Number(limit);

	const validate = () => {
		return new Promise((resolve, reject) => {
			if (isNaN(offset)) {
				throw {
					status: 400,
					message: 'offset is not a number'
				}
			}

			if (isNaN(limit)) {
				throw {
					status: 400,
					message: 'limit is not a number'
				}
			}
			resolve();
		})
	};

	const query = () => {
		const find = req.payload.app ?
			{
				hidden: false
			}
			:
			{
				$or: [
					{ hidden: false },
					{ $and: [ { author_id: mongoose.Types.ObjectId(req.payload._id) }, { hidden: true } ] }
				]

			};

		return new Promise((resolve, reject) => {
			Article.aggregate([
				{
					$match: find
				},
				{
					$sort: {
						reg_date: -1
					}
				},
				{
					$skip: offset
				},
				{
					$limit: limit
				},
				{
					$project: {
						_id: true,
						category: true,
						author_id: true,
                        author_nickname: true,
						mod_date: true,
						reg_date: true,
						star: true,
						hit: true,
						hidden: true,
						reply: true,
						tags: true,
						title: true,
						thumbnail_image: true,
						preview: true
					}
				}
			], (err, articles) => {
				if (err) throw err;
				resolve(articles);
			});
		});
	};

	const respond = (articles) => {
		res.status(200).json(articles);
	};

	const onError = (error) => {
		const status = error.status || 500;
		const message = error.message || 'somting broke';
		res.status(status).json({
			message: message
		})
	};

	validate()
		.then(query)
		.then(respond)
		.catch(onError)
});

/* =========================================
 GET /api/article/{id}
 ============================================*/
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) throw err;
		if (!article) {
			res.status(404).json({
				message: 'resource not found'
			});
			return;
		}
		article.hit++;
		article.save()
			.then(()=> {
				res.json(article);
			})
	});
});

/* =========================================
 PUT /api/article/{id}
 {
 	[optional]
 }
 ============================================*/
router.put('/:id', (req, res) => {
	Article.findOne({ _id: req.params.id }, (err, article) => {

		const validate = (category, author_id, author_nickname, title, content, hidden) => {

			return new Promise((resolve, reject) => {

				if (!req.payload.admin) throw { message: 'not admin' };
				//TODO validate form

				resolve();
			})
		};
		
		if (err) throw err;
		if (!article) {
			res.status(404).json({
				message: 'resource not found'
			});
			return;
		}

		const update = () => {
			return new Promise((resolve, reject) => {

				const data = req.body;

				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						if ((data[key] !== (undefined || null)) && data[key] !== '') {
							article[key] = data[key];
						}
					}
				}

				article.mod_date = Date.now();

				Article.update({ _id: req.params.id }, article, (err, result) => {
					if (err) reject(err);
					if (result.ok === 1) {
						resolve(article);
					} else {
						reject({
							status: 500,
							message: 'update failure'
						})
					}
				});
			});
		};

		const syncImage = (article) => {
			return new Promise((resolve, reject) => {

                // TODO Article document에 있는 이미지와 실제 DOM에 있는 이미지랑 Sync 해줘야 함.
                Article.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(article._id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'images',
                            localField: 'images',
                            foreignField: '_id',
                            as: 'images'
                        }
                    }
                ], (err, dbArticle) => {
                    // ** content에 있는 image와 실제 업로드된 image를 매칭시켜서
                    // 실제 사용하는 image만 서버에 남겨둠
					dbArticle = dbArticle[0];
                    jsdom.env(dbArticle.content, (err, window) => {
                        const dbImages = dbArticle.images;
                        const images = window.document.images;
                        let tempImages = [];

                        for (let x = 0; x < dbImages.length; x++) {
                            let exist = false;
                            for (let i = 0; i < images.length; i++) {
                                if (images[i].src.indexOf(dbImages[x].name) !== -1) {
                                    exist = true;
                                    break;
                                }
                            }

                            if (exist) {
                                tempImages.push(dbImages[x]._id);
                            } else {
                                fs.unlink(dbImages[x].real_path);
                                Image.find({ _id: dbImages[x]._id }).remove().exec();
                            }

                        }

						dbArticle.images = tempImages;
                        
                        // 썸네일 이미지 다시 지정
						if (dbArticle.images.length === 0) {
							dbArticle.thumbnail_image = '';
						} else {
							dbArticle.thumbnail_image = `${config.API_SERVER}/image/${dbImages[0].name}`;
						}

						Article.update({ _id: req.params.id }, dbArticle, (err, result) => {
							if (err) reject(err);
							if (result.ok === 1) {
								resolve(dbArticle);
							} else {
								reject({
									status: 500,
									message: 'update failure'
								})
							}
						});
                    });
                });
			});
		};

		const respond = (article) => {
			res.status(200).json({
				success: true,
				article
			});
		};

		const onError = (error) => {
			const status = error.status || 500;
			const message = error.message || 'somting broke';
			res.status(status).json({
				message: message
			})
		};

		validate()
			.then(update)
			.then(syncImage)
			.then(respond)
			.catch(onError);
	});
});

/* =========================================
 DELETE /api/article/{id}
 ============================================*/
router.delete('/:id', (req, res) => {

	if (!req.payload.admin) throw { message: 'not admin' };

	const aggregate = () => {
		return new Promise((resolve, reject) => {
			Article.aggregate([
				{
					$match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
					}
				},
                {
                    $lookup: {
                        from: 'images',
                        localField: 'images',
                        foreignField: '_id',
                        as: 'images'
                    }
                }
			], (err, result) => {
				if (err) reject(err);
                if (!result || result.length === 0) {
					reject({
						status: 404,
                        message: 'resource not found'
                    });
                }

				resolve(result[0]);
			})
		});
	};

	const remove = (article) => {
		return new Promise((resolve, reject) => {

			Article(article).remove((err, result) => {
				if (err) reject(err);

				const images = article.images;
				for (let i = 0; i < images.length; i++) {
					fs.unlink(images[i].real_path);
					Image.find({ _id: images[i]._id }).remove().exec();
				}

				resolve(true);
			});
		});
	};

	const respond = (success) => {
		res.status(200).json({
			success: success
		});
	};

    const onError = (error) => {
        const status = error.status || 500;
        const message = error.message || 'somting broke';
        res.status(status).json({
            message: message
        })
    };

	aggregate()
		.then(remove)
		.then(respond)
		.catch(onError);

});

export default router;