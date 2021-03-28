const User = require('../models/user-model');
const {
    validationResult
} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signUp = (req, res, next) => {
    const errors = validationResult({
        req: req
    });
    console.log(errors.array());
    if (!(errors.isEmpty())) {
        const error = new Error("Validation Failed!");
        error.statusCode = 422;
        // error.data = error.array();
        throw error;
    }
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    bcrypt.hash(password, 12).then((result) => {
        console.log(result);
        const user = new User({
            email: email,
            password: result,
            name: name
        });
        return user.save();
    }).then(data => {
        return res.status(201).json({
            message: "User Registered",
            userId: data._id
        });
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}
exports.logIn = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).then(result => {
        if (!result) {
            const error = new Error("Invaild Credentials");
            error.statusCode = 422;
            return next(error);
        }
        bcrypt.compare(req.body.password, result.password).then(comp_val => {
            if (!comp_val) {
                const error = new Error("Invaild Password");
                error.statusCode = 422;
                return next(error);
            }
            const token = jwt.sign({
                email: result.email,
                userId: result._id
            }, "thisissomethingtooobvious!", {
                expiresIn: "1h"
            })
            res.status(200).json({
                token: token,
                userId: result._id
            })
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        throw err;
    })
}