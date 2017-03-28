import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Comment = new Schema({
    author: {
        _id: Schema.Types.ObjectId,
        nickname: String,
        thumbnail_image: String,
        login_type: String
    },
    ref_article: Schema.Types.ObjectId,
    ref_comment: Schema.Types.ObjectId, // default: self
    comments: {type: String, default: '(내용없음)'},
    hidden: {type: Boolean, default: false},
    star: {type: Number, default: 0},
    reg_date: {type: Date, default: Date.now},
    mod_date: {type: Date, default: Date.now}
});

export default mongoose.model('Comment', Comment);