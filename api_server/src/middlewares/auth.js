import request from 'request';
import config from '../config';

const authMiddleware = (req, res, next) => {
	const token = req.headers['authorization'] || req.headers['x-access-token'] || req.query.token;

	if (!token) {
		return res.status(403).json({
			success: false,
			message: 'not logged in'
		});
	}

	const verify = new Promise((resolve, reject) => {
		request({
			url: config.AUTH_SERVER + '/auth/check',
			headers: {
				authorization: token
			}
		}, (error, response, body) => {
			if (!body) throw {
				message: 'empty body received'
			};
			const verified = JSON.parse(body);
			if (verified.success) {
				resolve(verified.info)
			} else {
				throw {
					status: 403,
					message: verified.message
				}
			}
		});
	});

    const onError = (error) => {
        const status = error.status || 500;
        const message = error.message || 'somting broke';
        res.status(status).json({
        	success: false,
            message: message
        })
    };

	verify.then((payload) => {
		req.payload = payload;
		next();
	}).catch(onError);
	
};

export default authMiddleware;