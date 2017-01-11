import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import crypto from 'crypto';
import config from '../config';

const User = new Schema({
	username: String,
	password: String,
	admin: {type: Boolean, default: false}
});

// create new User document
User.statics.create = function (username, password) {
	if (typeof password === 'number') password = password.toString();
	const encrypted = crypto.createHmac('sha1', config.SECRET).update(password).digest('base64');
	const user = new this({
		username,
		password: encrypted
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
	const encrypted = crypto.createHmac('sha1', config.SECRET).update(password).digest('base64');
	return this.password === encrypted;
};

User.methods.assignAdmin = function () {
	this.admin = true;
	return this.save()
};

export default mongoose.model('User', User);