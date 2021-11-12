// const { JWT_SECRET } = require("../secrets"); // use this secret!
// const jwt = require('jsonwebtoken');
 const User = require('../users/users-model');

const validateEmpty = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !username.trim() || !password || !password.trim()) {
        return next(({
            status: 401,
            message: 'username and password required'
        }));
    } else {
        next()
    }
};

const checkUsernameExists = async (req, res, next) => {
    const { username } = req.body;
    const [user] = await User.findBy({ username });
    try {
        if (!user) {
            return next({
                status: 401,
                message: 'username taken'
            });
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        next(err)
    }
};
    module.exports = {
        validateEmpty,
        checkUsernameExists,
    };
