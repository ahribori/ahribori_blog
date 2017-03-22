import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import crypto from 'crypto';

const User = new Schema({
	username: String,
	password: String,
	nickname: String,
	admin: {type: Boolean, default: false},
	reg_date: {type: Date, default: Date.now}
});

// create new User document
User.statics.create = function (username, password, nickname) {
	if (typeof password === 'number') password = password.toString();
	const encrypted = crypto.createHmac('sha1', process.env.SECRET).update(password).digest('base64');
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
	const encrypted = crypto.createHmac('sha1', process.env.SECRET).update(password).digest('base64');
	return this.password === encrypted;
};

User.methods.assignAdmin = function () {
	this.admin = true;
	return this.save()
};

export default mongoose.model('User', User);