import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Typography } from '@material-ui/core';
import { Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import axios from "axios";
import Navbar from "../components/Navbar";
import Comment from "../components/Comment";

const dummyPost = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aenean sed adipiscing diam donec adipiscing tristique. Pellentesque nec nam aliquam sem. Lectus nulla at volutpat diam. Sed nisi lacus sed viverra. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Blandit volutpat maecenas volutpat blandit aliquam etiam erat. Tincidunt arcu non sodales neque sodales ut. Malesuada proin libero nunc consequat interdum varius sit. A diam maecenas sed enim ut sem viverra. In hac habitasse platea dictumst. Morbi tincidunt augue interdum velit euismod in pellentesque massa. Mattis rhoncus urna neque viverra justo nec. Lorem mollis aliquam ut porttitor leo a. Laoreet non curabitur gravida arcu ac tortor. Amet nulla facilisi morbi tempus iaculis urna id volutpat."

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "100%",
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }
}));

const Post = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [comments, setComments] = useState([]);
    const [isLogged, setIsLogged] = useState(false);
    const [userData, setUserData] = useState({});
    const [commentInput, setCommentInput] = useState("");

    const getComments = async (threads) => {
        const DFS = (thread, commentsArray) => {
            var comment = {
                _id: thread._id,
                author: {
                    id: thread.author.id,
                    name: thread.author.name
                },
                commentText: thread.commentText,
                depth: thread.depth,
                parentId: thread.parentId,
                postedDate: thread.postedDate
            }
            commentsArray.push(comment);

            for(var child in thread.children){
                DFS(thread.children[child], commentsArray);
            }
        }
        var commentsArray = [];
        for(var baseComments in threads){
            DFS(threads[baseComments], commentsArray);
        }
        setComments(commentsArray);
        setCommentInput("");
    }

    useEffect(() => {
        const getData = async() => {
            await axios.get("/comments/get")
            .then( response => {
                console.log(response.data); /////////////
                setUserData(response.data.user);
                response.data.user===null ? setIsLogged(false) : setIsLogged(true);
                getComments(response.data.comments);
            })
            .catch(err => {
                console.log(err); ////////////
            })
        }
        getData();
    }, [])

    const typeComment = (e) => {
        setCommentInput(e.target.value);
    }

    const addComment = async (isReplyComment=false, parentComment=null, commentText=null) => {
        if (isReplyComment === false && commentInput === "") {
            return;
        }
        if (isReplyComment && commentText === "") {
            return;
        }
        let data = {
            id: userData.id,
            name: userData.name,
            commentText: isReplyComment ? commentText : commentInput
        }
        if(isReplyComment){
            data.parentId = parentComment._id;
            data.depth = parentComment.depth+1;
        }
        console.log(data); ////////////////

        await axios.post("/comments/add", data)
        .then( response => {
            console.log(response.data); /////////////
            setUserData(response.data.user);
            response.data.user===null ? setIsLogged(false) : setIsLogged(true);
            getComments(response.data.comments);
        })
        .catch( err => {
            console.log(err); ////////////
        })
    }

    const updateComment = async (data) => {
        await axios.post("/comments/edit", data)
        .then( response => {
            console.log(response.data); /////////////
            setUserData(response.data.user);
            response.data.user===null ? setIsLogged(false) : setIsLogged(true);
            getComments(response.data.comments);
        })
        .catch( err => {
            console.log(err); ////////////
        })
    }

    return (
        <div>
            <Navbar/>
            <Card className={classes.root}>
                <CardHeader
                    className="text-center"
                    title="Dummy Post. Please Login to comment"
                />
                <CardContent className="text-center">
                    <Typography variant="h6" component="p">
                        {dummyPost}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <Typography variant="body1" component="p">Comments</Typography>
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <div>
                            <Input 
                                value={commentInput} 
                                disabled={!isLogged} 
                                multiline rowsMin="1" maxRows="3" 
                                placeholder={!isLogged ? "Login to comment" : "Type your comment..."} 
                                style={{width: "100%"}} 
                                onChange={typeComment}/>
                            <Button 
                                size="small"
                                disabled={!isLogged}
                                color="primary"
                                variant="contained"
                                style={{backgroundColor: '#2196f3', marginTop: "1%"}}
                                onClick={()=>addComment(false,null,null)}
                                >
                                Submit
                            </Button>
                        </div>
                        <div>
                            {comments.map( (comment, index) => (
                                <Comment
                                    key={index}
                                    id={comment._id}
                                    addComment = {addComment}
                                    updateComment = {updateComment}
                                    commentData = {comment}
                                    userData = {userData}
                                    isLogged = {isLogged}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    );
}

export default Post;
