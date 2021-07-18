const User = require('../models/usersModel').User;
const bcrypt = require('bcrypt');
const saltRounds = 8;

const registerUser = async (req, res, next) => {
    try {
        await User.findOne({username: req.body.username})
        .exec()
        .then((foundUser) => {
            if(foundUser){
                console.log("username already exists"); ///////////////////
                return res.status(409).json({
                    status: 409,
                    message: "username already exists"
                })
            }
            else{
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err); ///////////////////
                        return res.status(500).json({
                            status: 500,
                            message: err
                        });
                    }
                    else{
                        const user = new User({
                            username: req.body.username,
                            password: hash
                        })
                        user.save()
                        .then((newUser) => {
                            console.log(`user ${newUser.username} registered succesfully`); ////////////////
                            return res.status(201).json({
                                status: 201,
                                message: "user registered succesfully"
                            });
                        })
                        .catch((err) => {
                            console.log(err); ///////////////////
                            return res.status(500).json({
                                status: 500,
                                message: err
                            });
                        })
                    }
                });
            }
        })
    } 
    catch (err) {
        console.log(err); //////////////////////
        return res.status(500).json({
            status: 500,
            message: err
        });
    }
}

const loginUser = async (req, res, next) => {
    try {
        await User.findOne({username: req.body.username})
        .exec()
        .then((foundUser) => {
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
                    if(err){
                        console.log(err); //////////////////////
                        return res.status(500).json({
                            status: 500,
                            message: err
                        });
                    }
                    else if(!match){
                        console.log("incorrect username or password"); //////////////////////
                        return res.status(401).json({
                            status: 401,
                            message: "incorrect username or password"
                        });
                    }
                    else{
                        console.log(`user ${foundUser.username} logged in successfully`); //////////////////////
                        return res.status(201).json({
                            status: 201,
                            message: "user logged in successfully"
                        });
                    }
                });
            }
            else{
                console.log("user not registered"); //////////////////////
                return res.status(401).json({
                    status: 401,
                    message: "incorrect username or password"
                });
            }
        })
    } 
    catch (err) {
        console.log(err); //////////////////////
        return res.status(500).json({
            status: 500,
            message: err
        });
    }
}

module.exports = {
    loginUser,
    registerUser
}


