import Sequelize from 'sequelize';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './repository.db',
	define: {
		timestamps: false
	}
});

const Speaker = sequelize.define('speaker', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	firstName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	affiliation: {
		type: Sequelize.STRING,
		allowNull: false
	}	
});

const Room = sequelize.define('room', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	capacity: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {
			min: 1
		}
	}	
});

const Session = sequelize.define('session', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: Sequelize.STRING,
	begin: {
		type: Sequelize.TIME,
		allowNull: false
	},
	end: {
		type: Sequelize.TIME,
		allowNull: false
	}
});

Room.hasMany(Session, {foreignKey: 'roomId'});
Session.belongsTo(Room, {foreignKey: 'roomId'});

Speaker.hasMany(Session, {foreignKey: 'speakerId'});
Session.belongsTo(Speaker, {foreignKey: 'speakerId'});

async function initialize() {
	await sequelize.authenticate();
	await sequelize.sync({alter: true});
}

export {
	initialize,
	Speaker, Room, Session
}