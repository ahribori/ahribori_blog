require('dotenv').load();
const env = process.env;
/* =========================================
 Load dependencies
 ============================================*/
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
/* =========================================
 Load Config.js
 ============================================*/
const port = env.PORT || 3000;

/* =========================================
 Express Configuration
 ============================================*/
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan('dev'));

// set public path
app.use('/', express.static(path.join(__dirname, './../public')));
app.use('/docs', express.static(path.resolve('docs_sdk')));
console.log(path.resolve('docs_sdk'))
app.use('/modules', express.static(path.resolve('node_modules')));

// index page, just for testing
import routes from './routes';
app.use('/', routes);

// open the server
app.listen(port, () => {
    console.log(`Express is running on port => ${port}`)
});

/* =========================================
 Mongoose Configuration
 ============================================*/
const MONGO_URI = env.MONGO_URI;
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', ()=> {
    console.log('connected to mongodb server =>', MONGO_URI);
});