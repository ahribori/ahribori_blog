import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Image = new Schema({
	original_name: String,
	name: String,
	real_path: String,
	size: Number,
	reg_date: {type: Date, default: Date.now},
});

Image.statics.create = function (original_name, name, real_path, size) {
	const image = new this({
		original_name,
		name,
		real_path,
		size
	});
	return image.save();
};

export default mongoose.model('Image', Image);