const db = require("../models");
const ampqController = require("./amqp.controller");
const {
    user: User,
    role: Role,
    patient_detail: PatientDetail,
    doctor_detail: DoctorDetail
} = db;

const Op = db.Sequelize.Op;

exports.testPost = (req, res) => {
    console.log('User post working ...')
    res.status(200).send({ message: "Post success" });
}

exports.findAll = (req, res) => {
    User.findAll(
        {
            attributes: [
                [db.sequelize.literal('"users"."id"'), 'id'],
                [db.sequelize.literal('"users"."lastname"'), 'lastname'],
                [db.sequelize.literal('"users"."firstname"'), 'firstname'],
                [db.sequelize.literal('"users"."email"'), 'email'],
                [db.sequelize.literal('"users"."username"'), 'username'],
                [db.sequelize.literal('"roles"."name"'), 'role'],
            ],
            include: {
                model: Role,
                as: 'roles',
                attributes: []
            },
        }).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findAllRoles = (req, res) => {
    let role = undefined;
    if (req.body.listRole === undefined)
        role = 'patient';
    else
        role = req.body.listRole;

    User.findAll(
        {
            attributes: ['id', 'lastname', 'firstname','email','username'],
            include: {
                model: Role,
                attributes: [],
                where: {
                    name: role
                }
            }
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single user with an id
exports.findOne = (req, res) => {
    const id = req.body.userId;
    User.findOne({ where: { id: id } })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "User with id " + id + " not found." });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with id=" + id });
        });
};

// Find all doctors an id
exports.findDoctors = async (req, res) => {
    let doctors = [];
    if (req.body.doctors.length > 0) {
        for (let doctorId of req.body.doctors) {
            console.log('Searching user: ' + doctorId)
            try {
                let newDoctor = await User.findOne(
                    {
                        where: { id: doctorId },
                        include: {
                            model: DoctorDetail,
                            as: 'doctor_detail'
                        }
                    }
                )
                if (newDoctor) {
                    console.log("newDoctor: " + JSON.stringify(newDoctor));
                    doctors.push(newDoctor);
                }
            } catch (e) {
                console.log(e)
            }
        }
        console.log('doctors found: ' + doctors.length)
        await res.status(200).send(doctors);
    } else {
        res
            .status(500)
            .send({ message: "Find doctors: Invalid request."});
    }
};

// Update user details by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    User.findOne({ where: { id: id } })
        .then(user => {
            if (!user) {
                res.status(404).send({
                    message: `Cannot find user with id=${id}.`
                });
            } else {
                let authorities = [];
                user.getRoles().then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        authorities.push("ROLE_" + roles[i].name.toUpperCase());
                    }
                    if (authorities.includes('ROLE_DOCTOR')) {
                        DoctorDetail.create({
                            userId: id,
                            dentalId: req.body.dentalId,
                            lunch: req.body.lunch,
                            fika: req.body.fika
                        }).then(async details => {
                            console.log(details)
                            user.status = true;
                            await user.save({ fields: ['status'] })
                                .then(() => console.log('user saved ...'))

                            await ampqController.publish({
                                queue: `dental-service/add-doctor`,
                                message: {
                                    userId: id,
                                    dentalId: req.body.dentalId
                                },
                                type: ""
                            }).then(() => console.log('AMQP msg sent ...'))

                            res.status(200).send(
                                {
                                    message: "User was updated successfully.",
                                    user: {
                                        status: user.status,
                                        doctorDetails: details
                                    }
                            });
                        }).catch(e => {
                            console.log(e)
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
};

