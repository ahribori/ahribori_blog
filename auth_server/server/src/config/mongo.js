/* eslint-disable no-console */
import mongoose from 'mongoose';
import logger from './logger';
import './env';

const URI = process.env.MONGO_URI ||
    'mongodb://localhost:27017/auth';
mongoose.connect(
    URI,
    {
        promiseLibrary: global.Promise,
        server: {
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 3000
        }
    }
);

mongoose.connection
    .on('reconnected', () => {
        logger.info(`           [Mongoose] Reconnected: ${new Date().toLocaleString()}`);
    })
    .on('connected', () => {
        logger.info(
            `           Running Mongoose Version: ${mongoose.version}`);
    })
    .on('error', (err) => {
        if (err.name === 'MongoError' &&
            err.message.includes('ECONNREFUSED')) {
            logger.error(`          [Mongoose] ${err.message} 
                            'MongoDB URI 다시 확인하세요': ${new Date().toLocaleString()}`);
            process.exit(1);
        } else {
            logger.error(err);
        }
    })
    .on('disconnected', () => {
        logger.info(`           [Mongoose] Disconnected: ${new Date().toLocaleString()}`);
    });

mongoose.Promise = global.Promise;

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        process.exit(0);
    });
});

export default mongoose;
