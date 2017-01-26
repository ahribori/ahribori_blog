import express from 'express';
const router = express.Router();
import User from '../models/user';
import Application from '../models/application';
const jwt = require('jsonwebtoken');
import authMiddleware from '../middlewares/auth';

/* =========================================
 POST /auth/register (Register User)
 {
 username,
 password
 }
 ============================================*/
router.post('/register', (req, res) => {
	const {username, password, nickname} = req.body;
	let newUser = null;
	const validate = () => {
		return new Promise((resolve, reject) => {
			if (!/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/.test(username)) {
				res.status(400).json({
					field: 'username',
					message: 'username should be an email'
				});
				return;
			}

			if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
				res.status(400).json({
					field: 'password',
					message: 'password should be more stronger'
				});
				return;
			}

			if (!/[a-zA-Z가-힣]{2,16}/.test(nickname)) {
				res.status(400).json({
					field: 'nickname',
					message: 'nickname should be 2-16 character'
				});
				return;
			}

			resolve();
		});
	};

	const create = (user) => {
		if (user) {
			throw new Error('username exists');
		} else {
			return User.create(username, password, nickname);
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

	validate().then(() => {
		User.findOneByUsername(username)
			.then(create)
			.then(count)
			.then(assign)
			.then(respond)
			.catch(onError);
	});

});

/* =========================================
 POST /auth/login (Login)
 {
 username,
 password
 }
 ============================================*/
router.post('/login', (req, res) => {
	const {username, password} = req.body;
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
							nickname: user.nickname,
							admin: user.admin
						},
						secret,
						{
							expiresIn: '7d',
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

/* =========================================
 GET /auth/check (Login)
 ============================================*/
router.use('/check', authMiddleware);
router.get('/check', (req, res) => {
	res.json({
		success: true,
		info: req.decoded
	});
});

/* =========================================
 POST /auth/registerApplication (Register Application)
 {
 app
 }
 ============================================*/
router.use('/registerApplication', authMiddleware);
router.post('/registerApplication', (req, res) => {
	const {app} = req.body;
	const secret = req.app.get('config').SECRET;
	const user = req.decoded;

	const createToken = (application) => {
		if (application) {
			throw new Error('application name exists');
		} else {
			return new Promise((resolve, reject) => {
				jwt.sign(
					{
						user: user._id,
						app
					},
					secret,
					{
						issuer: 'ahribori.com',
						subject: 'applicationInfo'
					}, (err, token) => {
						if (err) reject(err);
						resolve(token);
					}
				);
			});
		}
	};

	const respond = (token) => {
		res.json({
			message: 'application registered successfully',
			token
		});
	};

	const saveToDB = (token) => {
		return Application.create(app, user._id, token);
	};

	const onError = (error) => {
		res.status(403).json({
			message: error.message
		});
	};

	Application.findOneByApplicationName(app)
		.then(createToken)
		.then(saveToDB)
		.then(respond)
		.catch(onError);
});
export default router;