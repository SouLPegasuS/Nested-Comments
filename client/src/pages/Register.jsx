import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";


const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const add = async () => {
        if(username==="" || password===""){
            setMessage("Username or password cannot be empty");
            return;
        }
        let data = {
            username: username,
            password: password
        }
        await axios.post("/users/register", data)
        .then( response => {
            // console.log(response.data); 
            if(response.data.status===201){
                window.location = "/";
            }
            else{
                if(response.data.status===409){
                    setMessage("Username is already registered");
                }
                else{
                    setMessage("Incorrect username or password");
                }
            }
        })
        .catch( err => {
            console.log(err); ///////////////
            setMessage("Incorrect username or password");
        })
    }

    return (
        <div>
            <Navbar />
            <div className="text-center up user-container">
                <h2 className="mt-5"> Register Your Account </h2>
                <div>
                    <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        autoComplete="off"
                        style={{ width: "300px" }}
                        className="mt-3 pt-2 pb-2 pr-2 pl-2"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{ width: "300px" }}
                        className="mt-3 pt-2 pb-2 pr-2 pl-2"
                        required
                    />
                </div>
                <div>
                    <button onClick={() => add()} className="btn btn-dark mt-3 mb-3"> Register </button>
                </div>
                <h4> OR </h4>
                <div>
                    <Link to="/login">
                        <span
                            className="btn btn-dark mt-3">
                            Login
                        </span>
                    </Link>
                </div>
                <div className="mt-3">
                    <p> {message} </p>
                </div>
            </div>
        </div>
    )
}

export default Register;