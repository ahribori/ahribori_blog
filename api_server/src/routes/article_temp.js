import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import ArticleTemp from '../models/article_temp';
import Image from '../models/image';
import fs from 'fs';
/* =========================================
 POST /api/article_temp
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
	
	const { category, author_id, author_nickname, title, content, hidden } = req.body;

	const validate = (category, author_id, author_nickname, title, content, hidden) => {

		return new Promise((resolve, reject) => {

			if (!req.payload.admin) throw { message: 'not admin' };
			//TODO validate form

			resolve();
		})
	};

	const create = () => {
		return new Promise((resolve, reject) => {
			ArticleTemp.findOne({ author_id }, (err, article_temp) => {
				if (err) {
					reject(err);
				}
				if (article_temp) {
					reject({
						status: 200,
						message: 'article_temp already exist'
					});
				} else {
					resolve(ArticleTemp.create(category, author_id, author_nickname, title, content, hidden));
				}
			});
		});
	};

	const respond = () => {
		res.sendStatus(200);
	};

    const onError = (error) => {
        const status = error.status || 500;
        const message = error.message || 'somting broke';
        res.status(status).json({
            message: message
        })
    };

	validate(category, author_id, author_nickname, title, content, hidden)
		.then(create)
		.then(respond)
		.catch(onError);

});

/* =========================================
 GET /api/article_temp
 ============================================*/
router.get('/', (req, res) => {

	const validate = () => {
		return new Promise((resolve, reject) => {
			resolve();
		})
	};

	const query = () => {
		return new Promise((resolve, reject) => {
			ArticleTemp.findOne({ author_id: req.payload._id }, (err, article_temp) => {
				if (err) reject(err);
				if (!article_temp) {
					reject({
						status: 404,
						message: 'resource not found'
					})
				} else {
					resolve(article_temp);
				}
			});
		});
	};

	const respond = (article_temp) => {
		res.status(200).json(article_temp);
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
 GET /api/article_temp/{id}
 ============================================*/
router.get('/:id', (req, res) => {

    const validate = () => {
        return new Promise((resolve, reject) => {
        	const id = req.param.id;
        	if (!id) {
        		reject({
        			status: 400,
					message: 'invalid parameter'
				})
			} else {
            	resolve();
			}
        })
    };

	const find = () => {
		return new Promise((resolve, reject) => {
			ArticleTemp.findById(id, (err, article_temp) => {
				if (err) reject(err);
				if (!article_temp) {
					reject({
						status: 404,
						message: 'resource not found'
					});
				}
				resolve(article_temp);
			});
		});
	};

    const respond = (article_temp) => {
        res.status(200).json(article_temp);
    };

    const onError = (error) => {
        const status = error.status || 500;
        const message = error.message || 'somting broke';
        res.status(status).json({
            message: message
        })
    };

    validate().then(find).then(respond).catch(onError);

});

/* =========================================
 PUT /api/article_temp/{id}
 {
 	[optional]
 }
 ============================================*/
router.put('/:id', (req, res) => {

	const find = () => {
		return new Promise((resolve, reject) => {
			const id = req.params.id;
			if (!id) reject({
				status: 400,
				message: 'invalid parameter'
			});

            ArticleTemp.findOne({ _id: req.params.id }, (err, article_temp) => {
                if (err) reject(err);
                if (!article_temp) {
                    reject({
                        status: 404,
                        message: 'resource not found'
                    });
                }
                resolve(article_temp);
            });

		});
	};

	const validate = (article_temp) => {

		return new Promise((resolve, reject) => {

			if (!req.payload.admin) throw { message: 'not admin' };
			//TODO validate form

			resolve(article_temp);
		})
	};



	const update = (article_temp) => {
		return new Promise((resolve, reject) => {
			const data = req.body;
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					if (data[key] !== undefined) {
						article_temp[key] = data[key];
					}
				}
			}
			ArticleTemp.update({ _id: req.params.id }, article_temp, (err, result) => {
				if (err) reject(err);
				if (result.ok === 1) {
					resolve(article_temp);
				} else {
					reject({
						status: 500,
						message: 'update failure'
					})
				}
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

	find()
		.then(validate)
		.then(update)
		.then(respond)
		.catch(onError);
});

/* =========================================
 DELETE /api/article_temp/{id}
 ============================================*/
router.delete('/:id', (req, res) => {

	if (!req.payload.admin) throw { message: 'not admin' };

	ArticleTemp.findOne({ _id: req.params.id }, (err, article_temp) => {
		if (err) throw err;
		if (!article_temp) {
			res.status(404).json({
				message: 'resource not found'
			});
			return;
		}

		const remove = () => {
			return new Promise((resolve, reject) => {
				article_temp.remove((err, result) => {
					if (err) reject(err);
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
			res.status(409).json({
				message: error.message
			})
		};

		remove()
			.then(respond)
			.catch(onError);

	});

});


/* =========================================
 DELETE /api/article_temp_clear_images/{id}
 ============================================*/
router.delete('/clear_images/:id', (req, res) => {

    if (!req.payload.admin) throw { message: 'not admin' };
    ArticleTemp.aggregate([
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
	], (err, article_temp) => {
        if (err) throw err;
        if (!article_temp) {
            res.status(404).json({
                message: 'resource not found'
            });
            return;
        }

        const removeImages = () => {
            return new Promise((resolve, reject) => {
            	const images = article_temp.length > 0 ? article_temp[0].images : [];
            	for (let i = 0; i < images.length; i++) {
                    fs.unlink(images[i].real_path);
                    Image.find({ _id: images[i]._id }).remove().exec();
				}

                ArticleTemp.findOne(mongoose.Types.ObjectId(article_temp[0]._id), (err, result) => {
                    result.images = [];
                    result.save();
                });

				resolve(true);
            });
        };

        const respond = (success) => {
            res.status(200).json({
                success: success
            });
        };

        const onError = (error) => {
            res.status(409).json({
                message: error.message
            })
        };

        removeImages()
            .then(respond)
            .catch(onError);

    });

});

export default router;