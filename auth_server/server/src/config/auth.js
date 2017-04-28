import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const SECRET = process.env.AUTH_SECRET;
    const token = req.get('Authorization') ||
        req.get('x-access-token') ||
        req.query.token;

    const hasToken = new Promise(
        (resolve, reject) => {
            if (!token) {
                const err = new Error('UNAUTHORIZED');
                err.status = 401;
                reject(err);
            } else {
                resolve(token);
            }
        }
    );
    const verifyToken = (passedToken) => {
        if (!passedToken) {
            const err = new Error('UNAUTHORIZED');
            err.status = 401;
            throw err;
        }
        return new Promise(
            (resolve, reject) => {
                jwt.verify(token, SECRET, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            }
        );
    };
    const response = (decoded) => {
        if (decoded) {
            req.decoded = decoded;
        }
        return next();
    };
    const onError = (err) => {
        if (!res.headersSent) {
            if (err.name === 'TokenExpiredError' ||
                err.name === 'JsonWebTokenError') {
                err.status = 403;
            }
            res.status(err.status || 500).json({
                success: false,
                message: err.message
            });
        }
    };

    hasToken
        .then(verifyToken)
        .then(response)
        .catch(onError);
};

export default auth;
