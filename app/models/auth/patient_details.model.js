module.exports = (sequelize, Sequelize) => {
    const PatientDetail = sequelize.define("patient_details", {
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        postcode: {
            type: Sequelize.STRING
        }
    });
    return PatientDetail;
};
