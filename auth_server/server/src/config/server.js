import express from 'express';

import compress from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import errorhandler from './errorhandler';
import routes from '../routes';

export default (app) => {
    app.use(compress({
        filter(req, res) {
            return (/json|text|javascript|css|svg|xml/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(path.resolve('public')));
    app.use('/', routes);
    app.use('/docs', express.static(path.resolve('docs_sdk')));
    app.use('/modules', express.static(path.resolve('node_modules')));

    /**
     * Router 적용 시점을 기준으로
     * 위에는 전역 핸들링
     * 아래는 에러 핸들링
     */

    app.use(errorhandler.notFound);
    app.use(errorhandler.middleware);

    app.disable('x-powered-by');

    return app;
};
