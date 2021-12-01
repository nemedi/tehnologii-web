const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Course = sequelize.define('course', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 200]
        }
    }    
});

module.exports = Course;
