const Comment = require('../models/commentsModel').Comment;
const jwt = require('jsonwebtoken');


const addComment = async (req, res, next) => {
    let data = {
        author: {
            id: req.body.id,
            name: req.body.name
        },
        commentText: req.body.commentText
    }
    if ('parentId' in req.body) {
        data.parentId = req.body.parentId
    }
    if ('depth' in req.body) {
        data.depth = req.body.depth
    }
    const comment = new Comment(data);
    // console.log(comment); 
    comment.save()
    .then(newComment => {
        // console.log("Added comment"); 
        next();
    })
    .catch((err) => {
        console.log(err) ///////////////////
        next();
    })
}

const updateComment = async (req, res, next) => {
    const doc = await Comment.findOne({_id: req.body.id});
    doc.commentText = req.body.commentText;
    doc.save()
    .then( () => {
        // console.log("updated comment"); 
        next();
    })
    .catch( err => {
        console.log(err) ///////////////////
        next();
    })
}

const getComments = async (req, res, next) => {
    Comment.find({}).sort({postedDate: 1}).lean().exec()
    .then((baseComments) => {

        const DFS = (comment, threads) => {
            for (var thread in threads){
                parent = threads[thread];
                if(thread.toString() === comment.parentId.toString()){
                    parent.children[comment._id] = comment;
                    return;
                }
                if(parent.children){
                    DFS(comment, parent.children);
                }
            }
        }

        let threads = {};
        baseComments.forEach(comment => {
            comment["children"] = {};
            if(!comment.parentId){
                threads[comment._id] = comment;
            }
            else{
                DFS(comment, threads);   
            }
        });

        if('JWToken' in req.cookies){
            jwt.verify(req.cookies.JWToken, process.env.JWT_SECRET, (err, payload) => {
                if(!err){
                    return res.json({
                        user: payload,
                        comments: threads
                    })
                }
            })
        }
        else{
            res.cookie("JWToken", "", {maxAge: 1});
            return res.json({
                user: null,
                comments: threads
            })
        }
    })
    .catch((err) => {
        console.log(err) ///////////////////
    })
}

module.exports = {
    addComment,
    updateComment,
    getComments
}


