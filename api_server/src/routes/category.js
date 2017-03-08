import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Category from '../models/category';
import Article from '../models/article';
import Image from '../models/image';
import fs from 'fs';

/* =========================================
 POST /api/category
 ============================================*/
router.post('/', (req, res) => {

	const validate = () => {
		return new Promise((resolve, reject) => {
			const { name } = req.body;
			if (name !== undefined && name === '') {
			    reject({
			        status: 400,
                    message: 'name is empty space'
                })
            }
			Category.find({ name }, (err, result) => {
				if (err) reject(err);
				if (result.length > 0) {
					reject({
						status: 409,
						message: 'category name exist'
					})
				} else {
					resolve({ name });
				}
			});
		});
	};

	const setOrder = (category) => {
		return new Promise((resolve, reject) => {
			Category.aggregate([
				{
					$sort: {
						order: 1
					}
				}
			], (err, categories) => {
				if (err) reject(err);
				const length = categories.length;
				if (length === 0) {
					category.order = 0;
				} else {
					category.order = categories[length -1].order + 1;
				}
				resolve(category);
			});
		});
	};

	const create = (category) => {
		return new Promise((resolve, reject) => {
			Category(category).save((err, savedCategory) => {
				if (err) reject(err);
				resolve(savedCategory);
			});
		});
	};

	const respond = (response) => {
		res.status(200).json({
			success: true,
			response
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
		.then(setOrder)
		.then(create)
		.then(respond)
		.catch(onError)

});

/* =========================================
 GET /api/category
 ============================================*/
router.get('/', (req, res) => {

	const find = () => {
		return new Promise((resolve, reject) => {
			Category.aggregate([
				{
					$sort: {
						order: 1
					}
				}
			], (err, categories) => {
				if (err) reject(err);
				resolve(categories);
			})
		});
	};

	const respond = (response) => {
		res.status(200).json({
			success: true,
			response
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
		.then(respond)
		.catch(onError)

});

/* =========================================
 GET /api/category/{id}
 ============================================*/
router.get('/:id', (req, res) => {

	const find = () => {
		return new Promise((resolve, reject) => {
			Category.findOne(mongoose.Types.ObjectId(req.params.id) , (err, category) => {
				if (err) reject(err);
				resolve(category);
			})
		});
	};

	const respond = (response) => {
		res.status(200).json({
			success: true,
			response
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
		.then(respond)
		.catch(onError)

});

/* =========================================
 PUT /api/category/{id}
 ============================================*/
router.put('/:id', (req, res) => {

	const validate = () => {
		return new Promise((resolve, reject) => {
			const { name, prev_order } = req.body;

			if (prev_order) {
				const prev = Number(prev_order);
				if (isNaN(prev)) {
					reject({
						status: 400,
						message: 'prev_order is not a number'
					})
				}

				if (prev < -1) {
					reject({
						status: 400,
						message: 'invalid parameter values'
					})
				}
			}

			let resolveObject = {};
			if (name !== undefined) {
				resolveObject.name = name;
			}

			if (prev_order !== undefined) {
				resolveObject.prev_order = Number(prev_order);
				resolveObject.order = Number(prev_order) + 1;
			}

			resolve(resolveObject);
		});
	};

	const pushOrder = (category) => {
		return new Promise((resolve, reject) => {
			if (category.prev_order !== undefined) {
                Category.aggregate([
                    {
                        $match: {
                            order: {
                                $gt: category.prev_order
                            }
                        }
                    },
                    {
                        $sort: {
                            order: 1
                        }
                    }
                ], (err, categories) => {
                    if (categories.length > 0) {
                        let updateCount = 0;

                        for (var i = 0; i < categories.length; i++) {
                            Category(categories[i]).update({
                                order: categories[i].order + 1
                            }, (err, result) => {
                                if (err) reject(err);
                                updateCount++;
                                if (updateCount === categories.length) {
                                    resolve(category);
                                }
                            })
                        }
                    } else {
                        resolve(category);
                    }
                });
			} else {
                resolve(category);
			}
		});
	};

	const update = (category) => {
		let updateObject = {};
		if (category.name !== undefined) { updateObject.name = category.name }
		if (category.prev_order !== undefined) { updateObject.order = category.order }
		return new Promise((resolve, reject) => {
			Category.update({ _id: req.params.id }, updateObject, (err, result) => {
				if (err) reject(err);
				resolve(true);
			})
		});
	};

	const reorder = (success) => {
		return new Promise((resolve, reject) => {
			Category.aggregate([
				{
					$sort: {
						order: 1
					}
				}
			], (err, categories) => {
				let updateCount = 0;
				for (var i = 0; i < categories.length; i++) {
					categories[i].order = i;
					Category(categories[i]).update({
						order: i
					}, (err, result) => {
						if (err) reject(err);
						updateCount++;
						if (updateCount === categories.length) {
							resolve(categories);
						}
					})
				}
			});
		});
	};

	const respond = (response) => {
		res.status(200).json({
			success: true,
			response
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
		.then(pushOrder)
		.then(update)
		.then(reorder)
		.then(respond)
		.catch(onError)

});

/* =========================================
 DELETE /api/category/{id}
 ============================================*/
router.delete('/:id', (req, res) => {

	const remove = () => {
		return new Promise((resolve, reject) => {
			const id = req.params.id;

            Article.aggregate([
                {
                    $match: {
                        category: mongoose.Types.ObjectId(id)
                    }
                }
            ], (err, result) => {
                for (let i = 0; i < result.length; i ++) {
                	const article = Article(result[i]);
                	const images = article.images;
                	for (let x = 0; x < images.length; x++) {
                		Image.findOne(mongoose.Types.ObjectId(images[x]), (err, image) => {
                			if (err) reject(err);
                			fs.unlink(image.real_path);
                			image.remove();
						})
					}
                    article.remove((err,  removeResult) => {
                        if (err) reject(err);
                    });
                }

                Category({ _id: id }).remove((err, result) => {
                    if (err) reject(err);
                    resolve(result.result);
                })
            });
		});
	};

	const reorder = (success) => {
		return new Promise((resolve, reject) => {
			Category.aggregate([
				{
					$sort: {
						order: 1
					}
				}
			], (err, categories) => {
				const length = categories.length;
				if (length > 0) {
					let updateCount = 0;
					for (var i = 0; i < length; i++) {
						categories[i].order = i;
						Category(categories[i]).update({
							order: i
						}, (err, result) => {
							if (err) reject(err);
							updateCount++;
							if (updateCount === length) {
								resolve(categories);
							}
						})
					}
				} else {
                    resolve(categories);
				}
			});
		});
	};

	const respond = (response) => {
		res.status(200).json({
			success: true,
			response
		});
	};

	const onError = (error) => {
		const status = error.status || 500;
		const message = error.message || 'somting broke';
		res.status(status).json({
			message: message
		})
	};

	remove()
		.then(reorder)
		.then(respond)
		.catch(onError)

});

export default router;