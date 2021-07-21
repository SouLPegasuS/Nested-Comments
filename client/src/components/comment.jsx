import React, { useState } from "react";
import { Input, Button, Typography } from '@material-ui/core';

const Comment = (props) => {
    const [editClicked, setEditClicked] = useState(false);
    const [replyClicked, setReplyClicked] = useState(false);
    const [replyInput, setReplyInput] = useState("");
    const [editInput, setEditInput] = useState("");

    const editComment = (commentText) => {
        setEditClicked(true);
        setEditInput(commentText);
    }

    const saveEdit = (comment) => {
        let data = {
            id: comment._id,
            commentText: editInput
        };
        props.updateComment(data);
        setEditClicked(false);
        setEditInput("");
    }
    
    const typeEdit = (e) => {
        setEditInput(e.target.value);
    }

    const cancelEdit = () => {
        setEditClicked(false);
        setEditInput("");
    }

    const replyToComment = () => {
        setReplyClicked(true);
    }    

    const typeReply = (e) => {
        setReplyInput(e.target.value);
    }

    const cancelReply = () => {
        setReplyClicked(false);
        setReplyInput("");
    }

    const replySumbit = (parentComment) => {
        props.addComment(true, parentComment, replyInput);
        setReplyClicked(false);
        setReplyInput("");
    }

    let comment = props.commentData;
    const date = new Date(comment.postedDate).toLocaleString();
    const replyActionsStyle = {backgroundColor: '#ff0050', margin: "5px 0 0 5px", lineHeight: "1", color: "#000000", marginBottom: "0.5rem"};
    const marginleft = (comment.depth-1)*10+'%';
    return (
        <div className='single-comment' style={{marginLeft: marginleft}}>
                <div className="comment-header">
                <Typography style={{float: "left", color: "#999999"}} variant="body1" component="p">
                    {comment.author.name}:
                </Typography>
                <Typography style={{float: "right", color: "#999999"}} variant="body1" component="p">
                    {date}
                </Typography>
                </div>
                <div className="comment-content">
                    {editClicked ? 
                        <Input 
                            value={editInput} 
                            multiline rowsMin="1" maxRows="3" 
                            placeholder="Type your comment..." 
                            style={{width: "100%", color: "white"}} 
                            onChange={typeEdit}/>
                        :
                        <Typography className="comment-text" variant="body1" component="p">
                            {comment.commentText}
                        </Typography>
                    }
                    <div className="comment-actions">
                        {props.isLogged && comment.author.id === props.userData.id ?
                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                style={{backgroundColor: '#ff0050', color: "#000000"}}
                                onClick={editClicked ? () => saveEdit(comment) : () => editComment(comment.commentText)}
                            >
                                {editClicked ? "Save" : "Edit"}
                            </Button> : ''
                        }
                        <Button
                            size="small"
                            disabled={comment.depth > (editClicked ? 6 : 5)}
                            color="primary"
                            variant="contained"
                            style={{backgroundColor: '#ff0050', color: "#000000"}}
                            onClick={editClicked ? cancelEdit : replyToComment}
                        >
                            {editClicked ? "Cancel" : "Reply"}
                        </Button>
                    </div>
                </div>
                {replyClicked ? 
                <div className="reply-input">
                    <Input 
                        value={replyInput} 
                        multiline rowsMin="1" maxRows="3" 
                        disabled={!props.isLogged} 
                        placeholder={!props.isLogged ? "Login to comment" : "Type your reply..."} 
                        style={{width: "100%", color: "white"}} 
                        onChange={typeReply}/>
                    <div className="comment-action">
                        <Button 
                            disabled={!props.isLogged} 
                            size="small" color="primary" 
                            variant="contained" 
                            style={replyActionsStyle} 
                            onClick={() => replySumbit(comment)}>
                            Submit
                        </Button>
                        <Button 
                            size="small" color="primary" 
                            variant="contained" 
                            style={replyActionsStyle} 
                            onClick={cancelReply}>
                            Cancel
                        </Button>
                    </div>
                </div> : ""}
            </div>
    )
}

export default Comment;