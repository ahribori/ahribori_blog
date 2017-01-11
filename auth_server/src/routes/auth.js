import express from 'express';
const router = express.Router();
import User from '../models/user';
const jwt = require('jsonwebtoken');
import authMiddleware from '../middlewares/auth';

/* =========================================
		POST /auth/register (Register)
		{
			username,
			password
		}
 ============================================*/
router.post('/register', (req, res) => {
	const { username, password } = req.body;
	let newUser = null;

	const create = (user) => {
		if (user) {
			throw new Error('username exists');
		} else {
			return User.create(username, password);
		}
	};

	const count = (user) => {
		newUser = user;
		return User.count({}).exec();
	};

	const assign = (count) => {
		if (count === 1) {
			return newUser.assignAdmin();
		} else {
			return Promise.resolve(false);
		}
	};

	const respond = (isAdmin) => {
		res.json({
			message: 'registered successfully',
			admin: isAdmin ? true : false
		});
	};

	const onError = (error) => {
		res.status(409).json({
			message: error.message
		})
	};

	User.findOneByUsername(username)
		.then(create)
		.then(count)
		.then(assign)
		.then(respond)
		.catch(onError);

});

/* =========================================
 		POST /auth/login (Login)
		 {
			 username,
			 password
		 }
 ============================================*/
router.post('/login', (req, res) => {
	const { username, password } = req.body;
	const secret = req.app.get('config').SECRET;

	const check = (user) => {
		let promise = null;
		if (!user) {
			throw new Error('login failed');
		} else {
			if (user.verify(password)) {
				promise = new Promise((resolve, reject) => {
					jwt.sign(
						{
							_id: user._id,
							username: user.username,
							admin: user.admin
						},
						secret,
						{
							expiresIn: '1d',
							issuer: 'ahribori.com',
							subject: 'userInfo'
						}, (err, token) => {
							if (err) reject(err);
							resolve(token);
						}
					);
				});
				return promise;
			} else {
				throw new Error('login failed');
			}
		}
	};

	const respond = (token) => {
		res.json({
			message: 'logged in successfully',
			token
		});
	};

	const onError = (error) => {
		res.status(403).json({
			message: error.message
		});
	};

	User.findOneByUsername(username)
		.then(check)
		.then(respond)
		.catch(onError);

});

router.use('/check', authMiddleware);
/* =========================================
		 GET /auth/check (Login)
 ============================================*/
router.get('/check', (req, res) => {
	res.json({
		success: true,
		info: req.decoded
	});
});

export default router;