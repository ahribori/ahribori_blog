import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Application = new Schema({
	app: String,
	user: Schema.Types.ObjectId,
	token: String,
	reg_date: {type: Date, default: Date.now}
});

// create new User document
Application.statics.create = function (app, user, token) {
	const application = new this({
		app,
		user: mongoose.Types.ObjectId(user),
		token
	});

	// return the Promise
	return application.save()
};

// find one user by using applicaiton name
Application.statics.findOneByApplicationName = function (app) {
	return this.findOne({
		app
	}).exec()
};

// find one user by using user object id
Application.statics.findOneByUserId = function (user) {
	return this.findOne({
		user: mongoose.Types.ObjectId(user)
	}).exec()
};

export default mongoose.model('Application', Application);