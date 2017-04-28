import express from 'express';
const router = express.Router();
import User from '../models/user';

/* =========================================
		 	GET /user/list
 ============================================*/
router.get('/list', (req, res) => {
	if (!req.decoded.admin) {
		return res.status(403).json({
			message: 'you are not an admin'
		});
	}

	User.find({})
		.then((users) => {
			res.json(users);
		});
});

/* =========================================
 GET /user/:id
 ============================================*/
router.get('/:id', (req, res) => {
	const find = () => {
		return new Promise((resolve, reject) => {
			const id = req.params.id;
			User.findById(id,{
				nickname: true
			}, (err, user) => {
				if (err) reject(err);
				resolve(user);
			});
		});
	};

    const respond = (user) => {
        res.status(200).json(user);
    };

    const onError = (error) => {
        const status = error.status || 500;
        const message = error.message || 'somting broke';
        res.status(status).json({
            message: message
        })
    };

	find().then(respond).catch(onError);
});

/* =========================================
 			POST /user/assign-admin
 ============================================*/
router.post('/assign-admin/:username', (req, res) => {
	if (!req.decoded.admin) {
		return res.status(403).json({
			message: 'you are not an admin'
		})
	}

	User.findOneByUsername(req.params.username)
		.then(user => user.assignAdmin)
		.then(res.json({
			success: true
		})
	)
});

export default router;