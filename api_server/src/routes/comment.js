import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Article from '../models/article';
import Comment from '../models/comment';

/* =========================================
 POST /api/comment
 ============================================*/
router.post('/', (req, res) => {

    const { author, ref_article, ref_comment, ref_comment_comment, comments, hidden } = req.body;

    const validate = new Promise((resolve, reject) => {
        if (comments !== undefined && comments === '') {
            reject({
                status: 400,
                message: 'comment is empty space'
            })
        }
        Comment.aggregate([
            {
                $match: {
                    'author._id': mongoose.Types.ObjectId(author._id)
                }
            },
            {
                $project: {
                    reg_date: 1
                }
            },
            {
                $sort: {
                    reg_date: -1
                }
            },
            {
                $limit: 1
            }
        ], (err, results) => {
            if (err) reject(err);
            if (results[0]) {
                const reg_date = results[0].reg_date;
                const diff = Date.now() - reg_date.getTime();
                if (diff < 5000) {
                    reject({
                        status: 444,
                        message: 'comments는 5초에 한번만 등록할 수 있습니다'
                    })
                }
            }
            resolve();
        });
    });

    const create = (category) => new Promise((resolve, reject) => {
        new Comment({
            author,
            ref_article,
            ref_comment,
            ref_comment_comment,
            comments,
            hidden
        }).save((err, savedComments) => {
            if (err) reject(err);
            if (!savedComments.ref_comment) {
                savedComments.ref_comment = savedComments._id;
                savedComments.save((err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            } else {
                resolve(savedComments);
            }
        });
    });

    const updateArticle = (comments) => new Promise((resolve, reject) => {
        Article.findOne(comments.ref_article, (err, article) => {
            if (err) reject(err);
            if (article) {
                article.comments.push(comments._id);
                article.save((err, result) => {
                    if (err) reject(err);
                    resolve(comments);
                })
            } else {
                comments.remove((err) => {
                    if (err) reject(err);
                    reject({
                        status: 404,
                        message: 'article not found'
                    })
                });
            }
        });
    });

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

    validate
        .then(create)
        .then(updateArticle)
        .then(respond)
        .catch(onError)

});

/* =========================================
 GET /api/comment/{id}
 ============================================*/
router.get('/:id', (req, res) => {

    const find = new Promise((resolve, reject) => {
        Comment.findOne(mongoose.Types.ObjectId(req.params.id), (err, comment) => {
            if (err) reject(err);
            resolve(comment);
        })
    });

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

    find
        .then(respond)
        .catch(onError)

});

/* =========================================
 PUT /api/comment/{id}
 ============================================*/
router.put('/:id', (req, res) => {

    const { comments, hidden } = req.body;

    const validate = new Promise((resolve, reject) => {
        if (comments !== undefined && comments === '') {
            reject({
                status: 400,
                message: 'comment is empty space'
            })
        }
        resolve();
    });

    const update = () => new Promise((resolve, reject) => {
        Comment.update({ _id: req.params.id }, {
            comments,
            hidden
        }, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });

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

    validate
        .then(update)
        .then(respond)
        .catch(onError)

});

/* =========================================
 DELETE /api/comment/{id}
 ============================================*/
router.delete('/test/:id', (req, res) => {
	Comment.remove({ ref_comment: req.params.id}, (err, comments) => {
		console.log(comments);
		res.json(comments)
	});
});
router.delete('/:id', (req, res) => {

    const remove = new Promise((resolve, reject) => {
        Comment.find({ ref_comment: req.params.id }, (err, comments) => {
            if (err) reject(err);
            if (comments) {
				Comment.remove({ ref_comment: req.params.id}, (err) => {
					if (err) reject(err);
					resolve(comments);
				});
            } else {
                reject({
                    status: 404,
                    message: 'comments not found'
                })
            }
        });
    });

    const updateArticle = (comments) => new Promise((resolve, reject) => {
        Article.findOne(comments[0].ref_article, (err, article) => {
            if (err) reject(err);
			for (let i = 0; i < comments.length; i++) {
				const index = article.comments.indexOf(comments[i]._id);
				if (index > -1) {
					article.comments.splice(index, 1);
				}
			}
			console.log(article.comments);
            article.save((err) => {
                if (err) reject(err);
                resolve(comments);
            });
        });
    });

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

    remove
        .then(updateArticle)
        .then(respond)
        .catch(onError)

});

export default router;