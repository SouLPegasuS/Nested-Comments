const mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
    postId: {
        type: Number,
        default: 1
    },
    depth: {
        type: Number,
        default: 1
    },
    parentId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    children: {
        type: [commentSchema],
        default: []
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    author: {
        id: Schema.Types.ObjectId,
        name: String,
    },
    commentText: {
        type: String,
        required: true
    }
}, {timestamps: true});



const Comment = new mongoose.model("Comment", commentSchema);

export default Comment;