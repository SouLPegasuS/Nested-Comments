import React, { useState, useEffect } from "react";

const Comment = (props) => {


    // let comment = props.commentData;
    const date = new Date(comment.postedDate).toLocaleString();
    const replyActionsStyle = {backgroundColor: '#2196f3', margin: "5px 0 0 5px", lineHeight: "1"};
    // const marginleft = (comment.depth-1)*10+'%';
    return (
        <div className='single-comment' style={{marginLeft: marginleft}}>
                <div className="comment-header">
                    <div style={{float: "left"}}>{comment.author.name}:</div><div style={{float: "right"}}>{date}</div>
                </div>
                <div className="comment-content">
                    {this.state.editClicked ? 
                        <Input value={this.state.comment} multiline rows="3" rowsMax="5" placeholder="Type your comment..." style={{width: "100%"}} onChange={this.typeComment}/>:
                        <div className="comment-text">
                            {comment.commentText}
                        </div>
                    }
                    <div className="comment-actions">
                        {comment.author.id === getDataFromCookie('userId') ?
                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                style={{backgroundColor: '#2196f3'}}
                                onClick={this.state.editClicked ? () => this.saveEdit(comment) : () => this.editComment(comment.commentText)}
                            >
                                {this.state.editClicked ? "Save" : "Edit"}
                            </Button> : ''
                        }
                        <Button
                            size="small"
                            disabled={this.props.commentData.depth > 3}
                            color="primary"
                            variant="contained"
                            style={{backgroundColor: '#2196f3'}}
                            onClick={this.state.editClicked ? this.cancelEdit : this.replyToComment}
                        >
                            {this.state.editClicked ? "Cancel" : "Reply"}
                        </Button>
                    </div>
                </div>
                {this.state.replyClicked ? 
                <div className="reply-input">
                    <Input value={this.state.comment} multiline rows="2" rowsMax="3" disabled={!this.props.loggedIn} placeholder={!this.props.loggedIn?"Login to comment":"Type your reply..."} style={{width: "100%"}} onChange={this.typeComment}/>
                    <div className="comment-action">
                        <Button disabled={!this.props.loggedIn} size="small" color="primary" variant="contained" style={replyActionsStyle} onClick={() => this.replySumbit(comment)}>Submit</Button>
                        <Button size="small" color="primary" variant="contained" style={replyActionsStyle} onClick={this.replyCancel}>Cancel</Button>
                    </div>
                </div>:
                ""}
            </div>
    )
}

export default Comment;