import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
	const token = req.headers['authorization'] || req.headers['x-access-token'] || req.query.token;

	if (!token) {
		return res.status(403).json({
			success: false,
			message: 'not logged in'
		});
	}

	const decode = new Promise((resolve, reject) => {
		jwt.verify(token, req.app.get('config').SECRET, (err, decoded) => {
			if (err) reject(err);
			resolve(decoded);
		});
	});

	const onError = (error) => {
		res.status(403).json({
			success: false,
			message: error.message
		});
	};

	decode.then((decoded) => {
		req.decoded = decoded;
		next();
	}).catch(onError);
	
};

export default authMiddleware;