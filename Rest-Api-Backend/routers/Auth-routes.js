const router = require('express').Router();
const {
    body
} = require('express-validator');
const User = require('../models/user-model');
const AuthController = require('../controller/AuthController');
const bcrypt = require('bcryptjs');
router.put("/signup", body("email").trim().isEmail().withMessage("please enter a valid email").custom((value, {
        req
    }) => {
        // console.log(value);
        User.findOne({
            email: value
        }).then(result => {
            console.log(result);
            if (result) {
                return Promise.reject("User Already Registered");
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            throw err;
        })
    }).normalizeEmail(),
    body("password").trim().isLength({
        min: 5
    }),
    body("name").trim().isLength({
        min: 5
    }), AuthController.signUp);

router.post("/login", AuthController.logIn)

module.exports = router;