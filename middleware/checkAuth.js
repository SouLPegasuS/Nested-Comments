const User = require('../models/usersModel').User;
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.JWToken;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err){
                res.cookie("JWToken", "", {maxAge: 1});
                return res.status(401).json({
                    status: 401,
                    message: err
                });
            }      
            else{
                next();
            }  
        })
    }
    else{
        res.cookie("JWToken", "", {maxAge: 1});
        return res.status(401).json({
            status: 401,
            message: err
        });
    }
}

module.exports = { checkAuth }
