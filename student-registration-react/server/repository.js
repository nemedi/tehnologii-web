const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './repository.db',
	logging: false
});

const Student = sequelize.define('student', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	firstName: {type: DataTypes.STRING, allowNull: false},
	lastName: {type: DataTypes.STRING, allowNull: false},
	bornDate: DataTypes.DATEONLY,
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {isEmail: true}
	},
	phone: DataTypes.STRING,
	section: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {isIn: [['IE', 'CE', 'SE']]}
	},
	group: {type: DataTypes.INTEGER, allowNull: false}
}, {timestamps: false});

// The client sends empty strings for optional fields left blank.
const FIELDS = ['firstName', 'lastName', 'bornDate', 'email', 'phone', 'section', 'group'];
function sanitize(record) {
	const data = {};
	FIELDS.forEach(field => {
		const value = record[field];
		data[field] = value === '' || value === undefined ? null : value;
	});
	return data;
}

const ready = sequelize.sync();

module.exports = {
	ready,
	sanitize,
	Student
};
