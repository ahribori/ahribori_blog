require('dotenv').config();
const env = process.env;
import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Article from '../models/article';
import ArticleTemp from '../models/article_temp';
import Category from '../models/category';
import Image from '../models/image';
import jsdom from 'jsdom';
import fs from 'fs';
import Page from '../helpers/Page';
const syncCounts = (bypass) => {
    return new Promise((resolve, reject) => {
        Category.find({}, (err, categories) => {
            if (err) reject(err);
            let syncCount = 0;
            for (let i = 0; i < categories.length; i++) {
                Article.count({ category: categories[i]._id }, (err, count) => {
                    if (err) reject(err);
                    Category.update({ _id: categories[i]._id }, { count }, (err, result) => {
                        if (err) reject(err);
                        syncCount++;
						if (syncCount === categories.length) {
							resolve(bypass);
						}
                    });
                });
            }
        })
    });
};

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

			if (!req.payload.admin) reject({
				status: 403,
				message: 'not admin'
			});

			if (!category || category === '' || category === null) {
				reject({
					status: 400,
					message: 'invalid parameters'
				})
			}
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

                                    	// ***** 이미지 Max Width 정의
                                    	if (images[i].width > env.MAX_IMAGE_WIDTH) {
                                    		const bw = images[i].width;
                                    		const bh = images[i].height;
                                    		const aw = env.MAX_IMAGE_WIDTH;
                                    		const ah = (aw * bh) / bw;
											images[i].width = aw;
											images[i].height = ah;
										}

                                        // ***** 이미지 클릭했을 때 새 창에서 열기
										// images[i].style = 'cursor: pointer;';
										// images[i].setAttribute('onClick', 'window.open("'+ images[i].src +'", "_blank");');

                                        exist = true;
                                        break;
									}
								}

								if (exist) {
									article.images.push(tempImages[x]._id);
									if (!thumbnail_picked) {
										article.thumbnail_image = `${env.API_SERVER}/image/${tempImages[x].name}`;
										thumbnail_picked = true;
									}
								} else {
									fs.unlink(tempImages[x].real_path);
									Image.find({ _id: tempImages[x]._id }).remove().exec();
								}
							}

                            article.content = window.document.body.innerHTML;
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
		.then(syncCounts)
		.then(respond)
		.catch(onError);

});

/* =========================================
 GET /api/article?offset={offset}&limit={limit}
 ============================================*/
router.get('/', (req, res) => {
	let { offset = 0, limit = 10, category, search } = req.query;
	offset = Number(offset);
	limit = Number(limit);
	const currentPage = Math.floor(offset/limit) + 1;

	const validate = () => {
		return new Promise((resolve, reject) => {
			if (isNaN(offset)) {
				reject({
					status: 400,
					message: 'offset is not a number'
				})
			}

			if (isNaN(limit)) {
				reject({
					status: 400,
					message: 'limit is not a number'
				})
			}

			if (category !== undefined) {
				if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(category)) {
					reject({
						status: 400,
						message: 'category is not an objectId'
					})
				}
			}

			resolve();
		})
	};

	const buildQueryObject = () => {
		return new Promise((resolve, reject) => {
			let query = [
				{ $match: { $and: [] } }, // [0]
				{ $sort: { reg_date: -1 } }, // [1]
				{ $skip: offset }, // [2]
				{ $limit: limit	}, // [3]
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
			];

			// app token or user token
			if (req.payload.app) {
				query[0].$match.$and.push({
				    hidden: false
                })
            } else {
                query[0].$match.$and.push({
                    $or: [
                        { hidden: false },
                        {
                            $and: [
                                { author_id: mongoose.Types.ObjectId(req.payload._id) }, {hidden: true}
                            ]
                        }
                    ]
                })
			}

			// category exist
			if (category !== undefined) {
                query[0].$match.category = mongoose.Types.ObjectId(category)
			}

			// search exist
            if (search !== undefined) {
			    const regExp = new RegExp(search, 'gi');
			    query[0].$match.$and.push({
			       $or: [
                       {
                           title: {
                               $regex: regExp
                           }
                       },
                       {
                           content: {
                               $regex: regExp
                           }
                       }
                   ]
                });
            }
			resolve(query);
		});
	};

	const query = (query) => {
		return new Promise((resolve, reject) => {
			Article.aggregate(query, (err, articles) => {
				if (err) throw err;
				resolve({
					query,
					articles
				});
			});
		});
	};
	
	const pagination = (params) => {
		return new Promise((resolve, reject) => {
			const query = params.query;
			const articles = params.articles;
			Article.count(query[0].$match, (err, count) => {
				if (err) reject(err);
				const page = new Page(currentPage, count, limit, 7);
				resolve({
					articles,
					page
				})
			});
		});
	};

	const respond = (result) => {
		res.status(200).json({
			articles: result.articles,
			page: result.page
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
		.then(buildQueryObject)
		.then(query)
		.then(pagination)
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

		const {category, author_id, author_nickname, title, content, hidden} = req.body;

		const origin_category = article.category.toString();

		const validate = () => {

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

                                    // ***** 이미지 Max Width 정의
                                    if (images[i].width > env.MAX_IMAGE_WIDTH) {
                                        const bw = images[i].width;
                                        const bh = images[i].height;
                                        const aw = env.MAX_IMAGE_WIDTH;
                                        const ah = (aw * bh) / bw;
                                        images[i].width = aw;
                                        images[i].height = ah;
                                    }

                                    // ***** 이미지 클릭했을 때 새 창에서 열기
									// images[i].style = 'cursor: pointer;';
									// images[i].setAttribute('onClick', 'window.open("'+ images[i].src +'", "_blank");');

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

                        dbArticle.content = window.document.body.innerHTML;
						dbArticle.images = tempImages;
                        
                        // 썸네일 이미지 다시 지정
						if (dbArticle.images.length === 0) {
							dbArticle.thumbnail_image = '';
						} else {
							dbArticle.thumbnail_image = `${env.API_SERVER}/image/${dbImages[0].name}`;
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
			.then(syncCounts)
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
				resolve(article);
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
		.then(syncCounts)
		.then(respond)
		.catch(onError);

});

export default router;