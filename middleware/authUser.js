const User = require('../model/user');
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log("cookie" + token);
    if (token) {
        const decode = jwt.verify(token, 'secret');
        // console.log("decode" + decode._id);
        if (decode) {
            const user = await User.findOne({
                _id: decode._id, 'tokens.token': token
            });
            // console.log("user" + user);
            if (user) {
                req.token = token;
                req.user = user;
                console.log(req.user);
                console.log(req.token);
                next();
            } else {
                res.redirect('login');
            }
        } else {
            res.redirect('login');
        }
    } else {
        res.redirect('login');
    }

}

module.exports = requireAuth;