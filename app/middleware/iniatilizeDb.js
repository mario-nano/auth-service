const db = require("../models");
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const {
    user: User,
    role: Role,
    user_roles: UserRole,
} = db;

exports.initialDb = function initializeDbData() {
    (async () => {
        // User roles
        await Role.bulkCreate([
            { id: 1, name: "patient" },
            { id: 2, name: "office" },
            { id: 3, name: "doctor" },
            { id: 4, name: "admin" }
        ]).then(() => console.log("Roles are created ..."));

        await User.create(
            {
                lastname: 'Super',
                firstname: 'Admin',
                username: 'superadmin',
                email: 'dentistimo-admin@e-nomads.com',
                password: bcrypt.hashSync('AdminPass$%^789', 8),
                status: true
            }
        ).then(user => {
            user.setRoles([4], { through: { selfGranted: false } });
            console.log("Admin user is created ...");
        });

        await User.create(
            {
                lastname: 'Office',
                firstname: 'Admin',
                username: 'operator',
                email: 'operator@e-nomads.com',
                password: bcrypt.hashSync('AdminPass$%^789', 8),
                status: true
            }
        ).then(user => {
            user.setRoles([2], { through: { selfGranted: false } });
            console.log("Office admin is created ...");
        });
    })();
}
