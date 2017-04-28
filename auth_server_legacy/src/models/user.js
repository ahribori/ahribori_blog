require('dotenv').config();
const env = process.env;
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import crypto from 'crypto';

const User = new Schema({
	account_type: String, // ahribori(undefined), kakao, google, facebook
	username: String,
	password: String,
    nickname: String,
    social_id: String,
    thumbnail_image: String,
    admin: { type: Boolean, default: false },
    reg_date: { type: Date, default: Date.now },
    last_login: { type: Date, default: Date.now },
    blocked: { type: Boolean, default: false }
});

// create new User document
User.statics.create = function (username, password, nickname) {
	if (typeof password === 'number') password = password.toString();
	const encrypted = crypto.createHmac('sha1', env.SECRET).update(password).digest('base64');
	const user = new this({
		username,
		password: encrypted,
		nickname
	});

	// return the Promise
	return user.save()
};

// find one user by using username
User.statics.findOneByUsername = function (username) {
	return this.findOne({
		username
	}).exec()
};

// verify the password of the User documment
User.methods.verify = function (password) {
	if (typeof password === 'number') password = password.toString();
	const encrypted = crypto.createHmac('sha1', env.SECRET).update(password).digest('base64');
	return this.password === encrypted;
};

User.methods.assignAdmin = function () {
	this.admin = true;
	return this.save()
};

export default mongoose.model('User', User);