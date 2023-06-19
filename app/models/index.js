const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Auth - User, role models //
db.user = require("./auth/user.model")(sequelize, Sequelize);
db.role = require("./auth/role.model")(sequelize, Sequelize);
db.user_roles = require("./auth/user-roles.model")(sequelize, Sequelize);

db.patient_detail = require("./auth/patient_details.model")(sequelize, Sequelize);
db.doctor_detail = require("./auth/doctor_details.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: db.user_roles,
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: db.user_roles,
    foreignKey: "userId",
    otherKey: "roleId"
});

db.user.hasOne(db.patient_detail,{ as: 'patient_detail' });
db.patient_detail.belongsTo(db.user,{ foreignKey: 'userId', as: "user" });
db.user.hasOne(db.doctor_detail,{ as: 'doctor_detail', foreignKey: 'userId', sourceKey: "id" });
db.doctor_detail.belongsTo(db.user,{ foreignKey: 'userId', targetKey: "id" });

db.ROLES = ["patient", "office", "doctor", "admin"];

module.exports = db;
