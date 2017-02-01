import express from 'express';
const router = express.Router();
import Article from '../models/article';

/* =========================================
 POST /api/article
 {
 category,
 author,
 title,
 content,
 hidden
 }
 ============================================*/
router.post('/', (req, res) => {
	
	const { category, author, title, content, hidden } = req.body;

	const validate = (category, author, title, content, hidden) => {

		return new Promise((resolve, reject) => {

			if (!req.payload.admin) throw { message: 'not admin' };
			//TODO validate form

			resolve();
		})
	};

	const create = () => {
		return Article.create(category, author, title, content, hidden);
	};

	const respond = () => {
		res.sendStatus(200);
	};

	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	};

	validate(category, author, title, content, hidden)
		.then(create)
		.then(respond)
		.catch(onError);

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
		res.json(article);
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

		const validate = (category, author, title, content, hidden) => {

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
						if (data[key] && data[key] !== '') {
							article[key] = data[key];
						}
					}
				}

				article.save((err) => {
					if (err) reject(err);
				});
				resolve(article);
			});
		};

		const respond = (article) => {
			res.status(200).json({
				success: true,
				article
			});
		};

		const onError = (error) => {
			res.status(409).json({
				message: error.message
			})
		};

		validate()
			.then(update)
			.then(respond)
			.catch(onError);
	});
});

/* =========================================
 DELETE /api/article/{id}
 ============================================*/
router.delete('/:id', (req, res) => {

	if (!req.payload.admin) throw { message: 'not admin' };

	Article.findOne({ _id: req.params.id }, (err, article) => {
		if (err) throw err;
		if (!article) {
			res.status(404).json({
				message: 'resource not found'
			});
			return;
		}

		const remove = () => {
			return new Promise((resolve, reject) => {
				article.remove((err, result) => {
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

export default router;