const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const auth = req.get("Authorization");
    if(!auth){
        const err = new Error("Not Authorised");
        err.statusCode = 401;
        throw err;
    }
    const token = auth.split(" ")[1];
    var decodedtoken;
    try {
        decodedtoken = jwt.decode(token, "thisissomethingtooobvious");
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedtoken) {
        const err = new Error("Not Authenticated!");
        err.statusCode = 401;
        throw err;
    }
    req.userId = decodedtoken.userId;
    next();
}