import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Category = new Schema({
	name: { type: String },
	count: { type: Number, default: 0 },
	order: { type: Number }
});

export default mongoose.model('Category', Category);