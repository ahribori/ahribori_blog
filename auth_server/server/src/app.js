import express from 'express';
import figlet from 'figlet';

import logger from './config/logger';
import config from './config/server';

import './config/mongo';

const port = process.env.PORT || 30000;
const app = express();

config(app).listen(port, () => {
    figlet('AHRIBORI', (err, banner) => {
        if (err) {
            logger.error(err);
        } else {
            // eslint-disable-next-line no-console
            console.info(banner);
        }
        logger.info(
            `
                 *****************************************
                 ###### Running Ahribori OAuth Server ######
                 
                 Current Environment: ${process.env.NODE_ENV || 'localhost'}
                 Port: ${port} 
                 Date: ${new Date().toLocaleString()}
                 *****************************************`);
    });
});
