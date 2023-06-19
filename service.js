const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const axios = require("axios");
const AmqpController = require("./app/controllers/amqp.controller");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const ENV = process.env.NODE_ENV || "development";
const HOST = "authen-service.azurewebsites.net";
const PORT = 85;
const serviceName = process.env.SERVICE_NAME || "auth-service";
const apiGatewayHostname = process.env.API_GATEWAY_HOSTNAME;
const apiGatewayPort = process.env.API_GATEWAY_PORT;

// CORS options
app.use(cors({
    origin: function (origin, callback) {
        let corsOptions = { origin: `http://${HOST}` };
        let allowedDomains = [`http://${HOST}`];

        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin) return callback(null, true);

        if (allowedDomains.indexOf(origin) === -1) {
            let msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Import models and associations
const db = require("./app/models");

// DB Sync and Initialize data
const init = require('./app/middleware/iniatilizeDb')
db.sequelize.sync({force: false}).then(() => {
    console.log('Drop and Resync Db');
    /*init.initialDb();*/
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to auth-service." });
});

// routes
require('./app/routes/auth/auth.routes')(app);
require('./app/routes/auth/user.routes')(app);

AmqpController.connect().then(r => console.log(r));

app.listen(PORT, () => {
    axios({
        method: "POST",
        url: `http://${apiGatewayHostname}:${apiGatewayPort}/register`,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            serviceName: serviceName,
            protocol: "http",
            host: HOST,
            port: PORT,
            enabled: true
        },
    }).then((response) => {
        console.log(response.data);
    });
    console.log(`${serviceName} started on port ` + PORT);
});
