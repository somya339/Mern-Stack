const mongoose = require('mongoose');
const {
    modelName
} = require('./post-model');
const Schema = mongoose.Schema;
const User = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default : "I am New!"
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }]

});


module.exports = mongoose.model("User" , User, "rest-data");