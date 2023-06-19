const ampqController = require("./amqp.controller");
const db = require("../models");
const config = require("../config/auth.config");
const {
    user: User,
    role: Role,
    patient_detail: PatientDetail,
    doctor_detail: DoctorDetail
} = db;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
    // Save User to Database
    User.create({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        roles: req.body.roles,
        status: false
    })
        .then(async user => {
            const newUser = {
                lastname: user.lastname,
                firstname: user.firstname,
                username: user.username,
                email: user.email
            }

            if (req.body.roles.includes('patient')) {
                PatientDetail.create({
                    userId: user.id,
                    address: req.body.address,
                    city: req.body.city,
                    postcode: req.body.postcode,
                    phone: req.body.phone
                }).then(async details => {
                    console.log(details)
                    user.status = true;
                    await user.save({ fields: ['status'] })
                        .then(() => console.log('user saved ...'))
                }).catch(e => {
                    console.log(e)
                })
            }

            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.status(200).send({
                            message: "User was registered successfully!",
                            user: newUser
                        });
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.login = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(async user => {
            if (!user) {
                return res.status(404).send({ message: "User not found." });
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }

            let authorities = [];

            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }

                ampqController.publish({
                    message: 'You signed in!',
                    type: "",
                    queue: `${user.id}/notifications`
                })

                if (authorities.includes('ROLE_PATIENT')) {
                    PatientDetail.findOne(
                        { where: { userId: user.id } }
                    ).then(detail => {
                        res.status(200).send({
                            id: user.id,
                            username: user.username,
                            lastname: user.lastname,
                            firstname: user.firstname,
                            email: user.email,
                            status: user.status,
                            roles: authorities,
                            patientDetails: detail
                        });
                    })
                        .catch(e => {
                            console.log(e)
                        })
                } else if (authorities.includes('ROLE_DOCTOR')) {
                    DoctorDetail.findOne(
                        { where: { userId: user.id } }
                    ).then(detail => {
                        res.status(200).send({
                            id: user.id,
                            username: user.username,
                            lastname: user.lastname,
                            firstname: user.firstname,
                            email: user.email,
                            status: user.status,
                            roles: authorities,
                            doctorDetails: detail
                        });
                    })
                        .catch(e => {
                            console.log(e)
                        })
                }
                    else {
                    res.status(200).send({
                        id: user.id,
                        username: user.username,
                        lastname: user.lastname,
                        firstname: user.firstname,
                        email: user.email,
                        status: user.status,
                        roles: authorities
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.logout = (req, res) => {
    res.status(200).json({
        message: "Logged out"
    })
}
