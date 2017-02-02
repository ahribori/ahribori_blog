/* =========================================
			Load dependencies
============================================*/
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import authMiddleware from './middlewares/auth';
import CORS from './middlewares/CORS';
/* =========================================
			 Load Config.js
 ============================================*/
import config from './config';
const port = process.env.PORT || config.PORT || 3000;

/* =========================================
			Express Configuration
 ============================================*/
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan('dev'));

// set the config
app.set('config', config);

// set api router
import routes from './routes';
app.use('*', CORS);
app.use('/api', authMiddleware);
app.use('/api', routes);

// open the server
app.listen(port, () => {
	console.log(`Express is running on port => ${port}`)
});

// set public path
const publicPath = path.resolve('../', 'client/public/');
app.use('/', express.static(publicPath));


// react SPA routing
app.get('*', function (req, res, next) {
	const urlFilter = /(favicon)/;
	const rootUrl = req.path.split('/')[1];
	if (urlFilter.test(rootUrl)) return next();
	res.sendFile(path.join(publicPath, 'index.html'));
});

/* handle error */
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

/* =========================================
 			Mongoose Configuration
 ============================================*/
const MONGO_URI = config.MONGO_URI;
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', ()=> {
	console.log('connected to mongodb server =>', MONGO_URI);
});