module.exports = {
    HOST: "temuujin.e-nomads.com",
    USER: "altansukh_dbuser",
    PASSWORD: "SfIN47iavpNa",
    DB: "altansukh_dental",
    PORT: 5432,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
