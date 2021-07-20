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
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    author: {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
    },
    commentText: {
        type: String,
        required: true
    }
}, {timestamps: true});



const Comment = new mongoose.model("Comment", commentSchema);

module.exports = {
    Comment
}