require('dotenv').config();
const env = process.env;
import request from 'request';
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
			url: env.AUTH_SERVER + '/auth/check',
			headers: {
				authorization: token
			}
		}, (error, response, body) => {
			if (!body) return reject ({
				message: 'empty body received'
			});

			try {
				const verified = JSON.parse(body);
				if (verified.success) {
					resolve(verified.info)
				} else {
					reject ({
						status: 403,
						message: verified.message
					});
				}
			} catch (e) {
                reject ({
                    status: 500,
                    message: 'JSON parse error'
                });
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