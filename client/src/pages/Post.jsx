import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Typography } from '@material-ui/core';
import { Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
// import Comment from './Comment';

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

    return (
        <div>
            <Navbar/>
            <Card className={classes.root}>
                <CardHeader
                    className="text-center"
                    title="Dummy Post. Please Login to comment"
                />
                <CardContent className="text-center">
                    <Typography variant="body0" component="p">
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
                            <Input multiline rows="1" rowsMax="3" style={{width: "100%"}} />
                            <Button 
                                size="small"
                                // disabled={!this.props.loggedIn}
                                color="primary"
                                variant="contained"
                                style={{backgroundColor: '#2196f3', marginTop: "1%"}}
                                // onClick={this.addComment}
                                >
                                Submit
                            </Button>
                        </div>
                        <div>
                            {/* {comments.map((comment, index) => (
                                <Comment
                                    key={index}
                                    id={comment._id}
                                />
                            ))} */}
                        </div>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    );
}

export default Post;
