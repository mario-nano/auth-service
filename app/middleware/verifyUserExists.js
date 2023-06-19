const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkByUsername = (req, res, next) => {
    // Username check
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            next();
        }
    }).catch(error => {
        res.status(404).send({
            message: "Failed! Username does not exist!",
            error: error
        });
        return;
    })
};

const checkByUserEmail = (req, res, next) => {
    // Username check
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (Object.keys(user).length !== 0) {
            next();
        } else {
            res.status(404).send({
                message: "Failed! User with this email address does not exist!"
            });
            return;
        }
    }).catch(error => {
        res.status(404).send({
            message: "Failed! User with this email address does not exist!",
            error: error
        });
        return;
    })
};

const verifyUserExists = {
    checkByUsername: checkByUsername,
    checkByUserEmail: checkByUserEmail
};
module.exports = verifyUserExists;
