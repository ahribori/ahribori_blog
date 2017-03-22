require('dotenv').config();
/* =========================================
			Load dependencies
============================================*/
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import CORS from './middlewares/CORS';
/* =========================================
			 Load Config.js
 ============================================*/
const port = process.env.PORT || 3000;

/* =========================================
			Express Configuration
 ============================================*/
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan('dev'));

// set api router
import routes from './routes';
app.use('*', CORS);
app.use('/', routes);

// open the server
app.listen(port, () => {
	console.log(`Express is running on port => ${port}`)
});

// set public path
app.use('/', express.static(path.join(__dirname, './../public')));
if (process.env.IMAGE_REPOSITORY !== '') {
	app.use('/image', express.static(process.env.IMAGE_REPOSITORY));
}

/* handle error */
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

/* =========================================
 			Mongoose Configuration
 ============================================*/
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error);
db.once('open', ()=> {
	console.log('connected to mongodb server =>', MONGO_URI);
});