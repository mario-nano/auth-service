module.exports = (sequelize, Sequelize) => {
    const DoctorDetail = sequelize.define("doctor_details", {
        dentalId: {
            type: Sequelize.STRING
        },
        lunch: {
            type: Sequelize.STRING
        },
        fika: {
            type: Sequelize.STRING
        }
    });
    return DoctorDetail;
};
