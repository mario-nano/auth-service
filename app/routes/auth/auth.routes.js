const controller = require("../../controllers/auth.controller");
const { verifySignUp } = require("../../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        res.header("Content-Type", "application/json");
        next();
    });

    app.post(
        "/register", [
            verifySignUp.checkDuplicateUsername,
            verifySignUp.checkDuplicateEmail,
            verifySignUp.checkRolesExisted
        ], controller.register
    );

    app.post("/login", controller.login);
    app.post("/logout", controller.logout);
};
