import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Article = new Schema({

	category: {type: Schema.Types.ObjectId, ref: 'Category'},
	author_id: Schema.Types.ObjectId,
	author_nickname: String,
	title: {type: String, default: '(제목없음)'},
	content: {type: String, default: '(내용없음)'},
	preview:  {type: String, default: '(내용없음)'},
	tags: [String],
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	hidden: {type: Boolean, default: false},
	thumbnail_image: {type: String},
	images: [{type: Schema.Types.ObjectId}],
	hit: {type: Number, default: 0},
	star: {type: Number, default: 0},
	reg_date: {type: Date, default: Date.now},
	mod_date: {type: Date, default: Date.now}
});

Article.index({
	title: 'text',
	content: 'text'
});

Article.statics.create = function (category, author_id, author_nickname, title, content, preview, hidden) {
	const article = new this({
		category: category ? mongoose.Types.ObjectId(category) : undefined,
		author_id,
		author_nickname,
		title,
		content,
		preview,
		hidden
	});
	return article.save();
};

export default mongoose.model('Article', Article);