 const express = require('express');
 const app = express();
 const path = require('path');
 const router = require('./routers/router');
 const Authrouter = require('./routers/Auth-routes');
 const body = require('body-parser');
 const env = require('dotenv');
 const mongoose = require('mongoose');
 const multer = require('multer');
 const {
     v4: uuid
 } = require('uuid');
 env.config();
 //  body.urlencoded() this will be used when data is in the format 
 // x-www-form-urlencoded <form></form>

 const FileStorage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, "images");
     },
     filename: (req, file, cb) => {
         cb(null, uuid() + "-" + file.originalname);
     }
 })

 const fileFilter = (req, file, cb) => {
     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
         cb(null, true);
     } else {
         cb(null, flase);
     }
 }

 app.use(body.json()) // this will be used while handeling json data
 app.use(multer({
     fileFilter: fileFilter,
     storage: FileStorage
 }).single("image"));

 app.use("/images", express.static(path.join(__dirname, "images")));

 app.use((req, res, next) => {
     res.setHeader(
         "Access-Control-Allow-Origin", "*"
     )
     res.setHeader(
         "Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE"
     )
     res.setHeader(
         "Access-Control-Allow-Headers", "Content-Type , Authoriztaion"
     )
     next();
 })

 app.use("/feed", router);
 app.use("/auth", Authrouter);

 //error handeling middle ware
 app.use((err, req, res, next) => {
     const status = err.statusCode || 500;
     const message = err.message;
     const data = err.data;
     res.status(status).json({
         message: message,
         data: data
     })
 })

 mongoose.connect(`mongodb+srv://somyagupta:${process.env.DATAKEY}@shop.xcr2h.mongodb.net/product`, {
     useNewUrlParser: true,
     useUnifiedTopology: true
 }).then(() => {
     console.log("database connected!");
     app.listen(5000, () => {
         console.log("the server is running on the port 5000");
     })
 }).catch(err => {
     console.error(err);
 })