import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Category from '../models/category';
import Article from '../models/article';

/* =========================================
 POST /api/category
 ============================================*/
router.post('/', (req, res) => {

	const validate = () => {
		return new Promise((resolve, reject) => {
			const { name } = req.body;
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
			if (name) {
				resolveObject.name = name;
			}

			if (prev_order) {
				resolveObject.prev_order = prev_order;
				resolveObject.order = prev_order + 1;
			}

			resolve(resolveObject);
		});
	};

	const pushOrder = (category) => {
		return new Promise((resolve, reject) => {
			if (category.prev_order) {
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
                        if (categories[0]._id.toString() === req.params.id.toString()) {
                            reject({
                                status: 400,
                                message: 'prev_order must bigger then self order'
                            })
                        }

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
		if (category.name) { updateObject.name = category.name }
		if (category.prev_order) { updateObject.order = category.order }
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
			Article.remove({ category: id })
				.then(() => {
					Category.remove({ _id: id }, (err, result) => {
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

	remove()
		.then(reorder)
		.then(respond)
		.catch(onError)

});

export default router;