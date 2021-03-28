const validator = require('express-validator');
const fs = require('fs');
const path = require('path');
const PostModel = require('../models/post-model');
const User = require('../models/user-model');
const {
    post
} = require('../routers/router');
// const mongoose = require('mongoose');
// const { post } = require('../routers/router');
exports.getPosts = (req, res, next) => {

    const currentPage = req.query.page || 1;
    const postPerPage = 2;
    let totalItems;
    PostModel.find().countDocuments().then((count) => {
        totalItems = count;
        return PostModel.find().skip((currentPage - 1) * postPerPage);
    }).then((result) => {
        if (!result) {
            const error = new Error("Could not find the post.");
            error.statusCode = 404 // not found
            throw (error);
        }
        res.status(200).json({
            posts: result,
            totalItems: totalItems,
        })
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.createPost = (req, res, next) => {
    const err = validator.validationResult(req);
    if (!err.isEmpty()) {
        const error = new Error("there was some validation error!");
        error.statusCode = 422; // validation error
        throw error;
    }
    if (!req.file) {
        const error = new Error("No Image provided!");
        error.statusCode = 422; //validation error
        throw error;
    }
    var imageUrl = req.file.path.replace("\\", "/");
    let creator;
    console.log(req.body);
    const Post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    Post.save().then((result) => {
        return User.findById(req.userId)
    }).then(result => {
        console.log(result);
        creator = result;
        result.posts.push(Post);
        return user.save();
    }).then(result => {
        res.status(201).json({
            post: Post, //some thing was added in the server or database
            creator: {
                id: creator._id,
                name: creator.name
            }
        })
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500 //internal server error
        }
        next(err);
    });

}

exports.SinglePost = (req, res, next) => {
    // mongoose.fi
    const postId = req.params.postId;
    PostModel.findById(postId).then((result) => {
        if (!result) {
            const error = new Error("Could not find the post.");
            error.statusCode = 404 // not found
            throw (error);
        }
        // console.log(result)
        res.status(200).json({
            message: "the post was fetched",
            post: result
        })
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    });
}

exports.deleteSingle = (req, res, next) => {
    const Element = req.params.delete;
    console.log(Element);
    PostModel.findById(Element).then(result => {
        var imagePath = path.join(__dirname, "../");
        fs.unlink(imagePath + result.imageUrl, err => {
            console.log(err);
        });
    }).catch(err => {
        console.log("no image found");
    })
    PostModel.deleteOne({
        _id: Element
    }).then(result => {
        // console.log(result);
        res.status(200).json({
            message: "the post was deleted successfully"
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500 //internal server error
        }
    });
}


exports.editPost = (req, res, next) => {

    const edit = req.params.editpost
    var imageUrl;
    const err = validator.validationResult(req);
    if (!err.isEmpty()) {
        const error = new Error("there was some validation error!");
        error.statusCode = 422; // validation error
        throw error;
    }
    PostModel.findById(edit).then(async (result) => {
        console.log("file found");
        if (req.file) {
            imageUrl = req.file.path.replace("\\", "/");
        }
        if (!imageUrl) {
            const error = new Error("No File Picked.");
            error.statusCode = 422 // some field was left empty
            throw error;
        }
        console.log(imageUrl);
        clearImage(req.body.image);
        result.title = req.body.title
        result.content = req.body.content
        result.image = req.body.image
        if (result.creator.toString() !== result.userId) {
            const err = new Error("Not Authorized to delete this post!");
            err.statusCode = 403 //not authorized
            throw err;
        }
        // result.creator.name = req.body.creator.name
        // result.content = req.body.content
        const newPost = await result.save();
        res.status(200).json({
            message: "the post was edited successfully",
            post: newPost
        });
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500 // internal server error
        }
        next(err);
    });
}

// this function will clear the previously uploaded image as the 
// has to upload a new image while editing  a post

clearImage = (imagePath) => {
    imagePath = path.join(__dirname, "../images/" + imagePath);
    fs.unlink(imagePath, err => {
        console.log(err);
    });
}






// exports.createPost = (req, res, next) => {
//     console.log(req.body)
//     res.status(201).json({
//         title: req.body.title,
//         content: req.body.content
//     })
// }

// for code pen
/* const btn = document.querySelector("button");

btn.addEventListener("click" , () =>{
  
  fetch("http://localhost:3000/feed/posts" , {
  method : "Post",
    body:JSON.stringify({
      title : "this is the third post",
      content : "null"
    }),
    headers : {
    "Content-Type" : "application/json"
  }
  }).then((result) => result.json()).then(resultextracted => {
            console.log(resultextracted);
        })
        .catch((err) => {
            console.log(err);
        });
}) */