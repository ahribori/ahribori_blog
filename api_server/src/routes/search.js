import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Article from '../models/article';
import config from '../config';

router.get('/:query', (req, res) => {
	const queryString = req.params.query;
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

			hidden: false,
			$text: {
				$search: queryString
			}
		}
			:
		{
			$or: [
				{
					hidden: false
				},
				{
					$and: [
						{author_id: mongoose.Types.ObjectId(req.payload._id)}, {hidden: true}
					]
				}
			],
			$text: {
				$search: queryString
			}

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
			], (err, results) => {
				if (err) throw err;
				resolve(results);
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

export default router;