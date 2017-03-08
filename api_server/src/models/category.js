import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Category = new Schema({
	name: { type: String },
	count: { type: Number, default: 0 },
	order: { type: Number }
});

Category.pre('remove', function(next) {
	next();
});

export default mongoose.model('Category', Category);