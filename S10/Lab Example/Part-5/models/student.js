const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Student = sequelize.define('student', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },    
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Student;
