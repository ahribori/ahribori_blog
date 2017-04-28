import logger from './logger';

export default {
    notFound(req, res, next) {
        const err = new Error('NotFound');
        err.status = 404;

        if (res.headersSent) {
            return next(err);
        }
        return next(err);
    },

    middleware(err, req, res, next) {
        if (!res.headersSent && err) {
            if (err.name !== 'Error' || err.code) {
                err.status = 500;
            }
            if (err.status === 500) {
                logger.error(err);
            }

            res.status(err.status || 400).json({ message: err.message });
        }
        return err.status === 404 ? next() : next(err);
    },

    onError(err, req, res) {
        logger.error(err);
        if (!res.headersSent) {
            if (!err.status) {
                err.status = 500;
            }

            res.status(err.status).json({
                status: err.status,
                message: err.message || 'internal server error'
            });
        }
    }
};
