require('dotenv').config();
const env = process.env;
import express from 'express';
const router = express.Router();
import User from '../models/user';
import Application from '../models/application';
const jwt = require('jsonwebtoken');
import authMiddleware from '../middlewares/auth';
import fs from 'fs';
import path from 'path';

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
	const secret = env.SECRET;

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
							resolve({
								token,
								user: {
									_id: user._id,
									nickname: user.nickname,
									admin: user.admin
								}
							});
						}
					);
				});
				return promise;
			} else {
                const err = new Error('LOGIN FAILED');
                err.status = 403;
                throw err;
			}
		}
	};

	const respond = ({ token, user }) => {
        res.send({
            success: true,
            auth: {
                token,
				user
            }
        });
	};

	const onError = (error) => {
        res.send({
            success: false,
            error: {
                status: error.status || 500,
                message: error.message || 'INTERNAL SERVER ERROR'
            }
        });
	};

	User.findOneByUsername(username)
		.then(check)
		.then(respond)
		.catch(onError);

});

/* =========================================
 POST /auth/oauth (oAuth save)
 {
 	account_type
 	social_id
 	nickname
 	thumbnail_image
 }
 ============================================*/
router.post('/oauth', (req, res) => {
	const { account_type, social_id, nickname, thumbnail_image } = req.body;
    const secret = env.SECRET;

	const findUserBySocialId = new Promise((resolve, reject) => {
		User.findOne({ social_id }, (err, user) => {
			if (err) reject(err);
			if (!user) {
				new User({
					account_type,
					social_id,
					nickname,
					thumbnail_image
				}).save((err, user) => {
					if (err) reject(err);
					resolve(user);
				})
			} else {
				user.account_type = account_type;
				user.nickname = nickname;
				user.thumbnail_image = thumbnail_image;
				user.last_login = Date.now();
				user.save((err, result) => {
					if (err) reject(err);
					resolve(result);
				});
			}
		})
	});

    const createToken = (user) => new Promise((resolve, reject) => {
        jwt.sign(
            {
                _id: user._id,
				type: user.account_type,
				s_id: user.social_id,
                nickname: user.nickname,
				thumbnail_image: user.thumbnail_image,
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

    const respond = (token) => {
        res.status(200).json({
            success: true,
            token
        });
    };

    const onError = (error) => {
        const status = error.status || 500;
        const message = error.message || 'somting broke';
        res.status(status).json({
            message: message
        })
    };

	findUserBySocialId
		.then(createToken)
		.then(respond)
		.catch(onError)
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
	const secret = env.SECRET;
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

router.use('/initializeSDK', authMiddleware);
router.get('/initializeSDK', (req, res) => {
    res.json({
        success: true // or false
    });
});

/**
 * GET /auth/createLoginButton
 * @param req
 * @param res
 */
router.get('/createLoginButton', (req, res) => {
    const readTemplates = new Promise((resolve, reject) => {
        const htmlPath = path.resolve('public/login_button.html');
        fs.readFile(htmlPath, 'utf8', (err, file) => {
            if (err) reject({ status: 404, message: 'button templates not found' });
            resolve(file);
        });
    });

    const applyStyle = file => new Promise((resolve) => {
        const size = req.query.size;
        let semanticClass = 'ui violet basic button ';

        switch (size) {
            case 'small':
                semanticClass += 'mini';
                break;
            case 'medium':
                semanticClass += 'medium';
                break;
            case 'large':
                semanticClass += 'big';
                break;
            default:
                semanticClass += 'medium';
        }

        const changedFile = file
            .replace('{{{class}}}', `${semanticClass}`)
            .replace('{{{icon}}}', 'privacy icon')
            .replace('{{{continue}}}', '');
        resolve(changedFile);
    });

    const respond = (button) => {
        res.send(button);
    };

    const onError = (error) => {
        const status = error.status || 500;
        res.sendStatus(status).json({
            status,
            message: error.message || 'internal server error'
        });
    };

    readTemplates
        .then(applyStyle)
        .then(respond)
        .catch(onError);
});

export default router;