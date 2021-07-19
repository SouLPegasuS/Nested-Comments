import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";


const Post = () => {

    return(
        <div> 
            <Navbar/>
            <h1>Hi there, this is dummy post, please login to comment</h1>
        </div> 
    )
}

export default Post;