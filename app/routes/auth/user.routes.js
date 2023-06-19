const controller = require("../../controllers/user.controller");
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

    app.get("/users", controller.findAll);

    app.post("/users", controller.testPost);

    app.post("/doctors", controller.findDoctors);

    app.get("/users-roles", controller.findAllRoles);

    app.get("/users-one", controller.findOne);

    app.put("/users/:id", controller.update);
};
