import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Typography } from '@material-ui/core';
import { Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import axios from "axios";
import Navbar from "../components/Navbar";
import Comment from "../components/Comment";

const dummyPost = "This is a dummy post. First Register as a new user or login in your existing account to add comments or replies. Once logged in you can also edit comments and replies added by you. You will remain logged in for maximum 3 hours after which cookie containing your auth token will expire. I have implemented Depth First Traversal Graph algorithm to get comments from MongoDB and render in React component. Have fun :)"

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "100%",
        backgroundColor: "#181818",
        color: "white"
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
                // console.log(response.data); 
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
        // console.log(data); 

        await axios.post("/comments/add", data)
        .then( response => {
            // console.log(response.data); 
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
            // console.log(response.data); 
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
                        <Typography style={{color: "#999999"}} variant="body1" component="p">Comments</Typography>
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
                                style={{width: "100%", color: "white"}} 
                                onChange={typeComment}/>
                            <Button 
                                size="small"
                                disabled={!isLogged}
                                color="primary"
                                variant="contained"
                                style={{backgroundColor: '#ff0050', marginTop: "1%", color:"black"}}
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
