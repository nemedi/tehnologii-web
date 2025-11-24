const Sequelize = require('sequelize');
const settings = require('./repository.json');

const sequelize = new Sequelize(
	settings.database,
	settings.user,
	settings.password, {
		host: settings.host,
		port: settings.port,
		dialect: settings.dialect
	}
);
const Contact = sequelize.define('contact', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	firstName : {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName : {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	}
}, {timestamps: false});
const Room = sequelize.define('room', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	name : {
		type: Sequelize.STRING,
		allowNull: false
	},
	capacity : {
		type: Sequelize.TINYINT,
		allowNull: false,
		validate: {
			min: 1
		}
	}
}, {timestamps: false});
const Meeting = sequelize.define('meeting', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	subject : {
		type: Sequelize.STRING,
		allowNull: false
	},
	description : Sequelize.STRING,
	begin: {
		type: Sequelize.DATE,
		allowNull: false
	},
	end: {
		type: Sequelize.DATE,
		allowNull: false
	}
}, {timestamps: false});

const Attendees = sequelize.define('attendees', {
}, {timestamps: false});

Room.hasMany(Meeting, {foreignKey: 'roomId'});

Contact.hasMany(Meeting, {foreignKey: 'organizerId'});

Contact.belongsToMany(Meeting, {through : Attendees});

async function initialize() {
	await sequelize.sync();
}

module.exports = {
	initialize,
	Contact,
	Room,
	Meeting
}
