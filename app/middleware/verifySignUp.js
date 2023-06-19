const db = require("../models");
const Roles = db.ROLES;
const User = db.user;

const checkDuplicateUsername = (req, res, next) => {
    if (!req.body.username || req.body.username === '' || req.body.username === undefined) {
        res.status(400).send({ message: "User information not complete! Please check all fields." });
        return;
    }

    // Username check
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }
        next();
    });
};
const checkDuplicateEmail = (req, res, next) => {
    if (!req.body.email || req.body.email === '' || req.body.email === undefined) {
        res.status(400).send({ message: "User information not complete! Please check all fields." });
        return;
    }

    // Email check
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Email address is already in use!"
            });
            return;
        }
        next();
    });
};
const checkRolesExisted = (req, res, next) => {
    if (!req.body.roles || req.body.roles.length === 0) {
        res.status(400).send({ message: "User information not complete! Please check all fields." });
        return;
    }

    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!Roles.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }
    next();
};
const verifySignUp = {
    checkDuplicateUsername: checkDuplicateUsername,
    checkDuplicateEmail: checkDuplicateEmail,
    checkRolesExisted: checkRolesExisted
};
module.exports = verifySignUp;
