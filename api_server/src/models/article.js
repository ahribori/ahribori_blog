import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Article = new Schema({

	category: {type: Schema.Types.ObjectId, ref: 'Category'},
	author: Object,
	title: {type: String, default: '(제목없음)'},
	content: {type: String, default: '(내용없음)'},
	tags: [String],
	reply: [{type: Schema.Types.ObjectId, ref: 'Reply'}],
	hidden: {type: Boolean, default: false},
	hit: {type: Number, default: 0},
	star: {type: Number, default: 0},
	reg_date: {type: Date, default: Date.now},
	mod_date: {type: Date, default: Date.now}
});

Article.index({
	title: 'text',
	content: 'text'
});

Article.statics.create = function (category, author, title, content, hidden) {
	const article = new this({
		category: category ? mongoose.Types.ObjectId(category) : undefined,
		author,
		title,
		content,
		hidden
	});
	return article.save();
};

export default mongoose.model('Article', Article);