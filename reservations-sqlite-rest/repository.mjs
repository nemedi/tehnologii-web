import Sequelize from 'sequelize';
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './reservations.db'
});
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
});
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
});
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
});
Room.hasMany(Meeting, {foreignKey: 'roomId'});
Meeting.belongsTo(Room, {foreignKey: 'roomId'});
Contact.hasMany(Meeting, {foreignKey: 'organizerId'});
Meeting.belongsTo(Contact, {foreignKey: 'organizerId'});
async function initialize() {
	await sequelize.authenticate();
	await sequelize.sync({alter: true});
}
export {
	initialize,
	Contact,
	Room,
	Meeting
};
