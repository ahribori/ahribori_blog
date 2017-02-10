import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ArticleTemp = new Schema({
	category: {type: Schema.Types.ObjectId, ref: 'Category'},
	author: Schema.Types.ObjectId,
	title: {type: String, default: ''},
	content: {type: String, default: ''},
	tags: [String],
	hidden: {type: Boolean, default: false},
	images: [{type: Schema.Types.ObjectId}],
	reg_date: {type: Date, default: Date.now},
	mod_date: {type: Date, default: Date.now}
});

ArticleTemp.statics.create = function (category, author, title, content, hidden) {
	const article = new this({
		category: category ? mongoose.Types.ObjectId(category) : undefined,
		author,
		title,
		content,
		hidden
	});
	return article.save();
};

export default mongoose.model('ArticleTemp', ArticleTemp);