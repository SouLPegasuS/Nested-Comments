const User = require('../models/usersModel').User;
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.JWToken;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err){
                res.cookie("JWToken", "", {maxAge: 1});
            }
        })
    }
    else{
        res.cookie("JWToken", "", {maxAge: 1});
    }
    next();
}

module.exports = { checkAuth }
