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
    if ('parentId' in req.body) {
        Comment.findById(req.body.parentId, (err, parent) => {
            if(err){
                console.log(err); //////////////
                next();
            }
            else{
                parent.children.push(comment);
                parent.save(function(){
                    console.log("Added reply"); //////////
                    next();
                })
            }
        })
    }
    else{
        comment.save()
        .then(newComment => {
            console.log("Added comment"); //////////
            next();
        })
        .catch((err) => {
            console.log(err) ///////////////////
            next();
        })
    }
}

const updateComment = async (req, res, next) => {
    if(req.body.depth==1){
        Comment.updateOne({_id: req.body.id}, {$set: {commentText: req.body.commentText}}, function(err){
            if(!err){
                Comment.findById(req.body.id, function(err, foundComment){
                    foundComment.save(function(){
                        console.log("updated comment"); //////////////
                        next();
                    })
                })
            }
        })
    }
    else{
        Comment.updateOne({_id: req.body.parentId, "children._id": req.body.id}, 
        {$set: {"children.$.commentText": req.body.commentText}}, function(err){
            if(!err){
                Comment.findById(req.body.parentId, function(err, foundComment){
                    foundComment.save(function(){
                        console.log("updated comment"); //////////////
                        next();
                    })
                })
            }
        })
    }
}

const getComments = async (req, res, next) => {
    Comment.find({parentId: null}).sort({postedDate: 1}).exec()
    .then((baseComments) => {
        const DFS = (parent, comments) => {
            comments.push(parent);
            parent.children.forEach(child => {
                DFS(child, comments);
            })
        }
        let comments = [];
        baseComments.forEach(element => {
            DFS(element, comments);
        });
        if('JWToken' in req.cookies){
            jwt.verify(req.cookies.JWToken, process.env.JWT_SECRET, (err, payload) => {
                if(!err){
                    return res.json({
                        user: payload,
                        comments: comments
                    })
                }
            })
        }
        res.cookie("JWToken", "", {maxAge: 1});
            return res.json({
            user: null,
            comments: comments
        })
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


