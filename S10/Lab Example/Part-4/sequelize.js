const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlite/database.db',
    define: {
		timestamps: false
	}
});

module.exports = sequelize;
