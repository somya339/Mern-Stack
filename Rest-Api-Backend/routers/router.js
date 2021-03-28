const router = require('express').Router();
const controller = require('../controller/controller');
const {
    body
} = require('express-validator');
const isAuth = require('../middleware/is-auth');
//  express-validator is a middleware module which validates 
// the data before being the request carry forward 

router.get("/posts", isAuth, controller.getPosts); // will not apply on this route as get routes don't have a body


router.post("/posts", isAuth, body("title").trim().isLength({
    min: 5
}), body("content").trim().isLength({
    min: 5
}), controller.createPost);

router.get("/post/:postId", isAuth, controller.SinglePost);

router.post("/delete/:delete", isAuth, controller.deleteSingle);


router.put("/edit/:editpost", isAuth, body("title").trim().isLength({
    min: 5
}), body("content").trim().isLength({
    min: 5
}), controller.editPost);

module.exports = router;