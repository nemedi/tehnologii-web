import Sequelize from 'sequelize';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './repository.db',
	logging: false
});

const id = () => ({
	type: Sequelize.UUID,
	defaultValue: Sequelize.UUIDV4,
	allowNull: false,
	primaryKey: true
});

const Speaker = sequelize.define('speaker', {
	id: id(),
	name: {type: Sequelize.STRING, allowNull: false},
	company: Sequelize.STRING,
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {isEmail: true}
	}
}, {timestamps: false});

const Venue = sequelize.define('venue', {
	id: id(),
	name: {type: Sequelize.STRING, allowNull: false},
	city: {type: Sequelize.STRING, allowNull: false},
	seats: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {min: 1}
	}
}, {timestamps: false});

const Event = sequelize.define('event', {
	id: id(),
	title: {type: Sequelize.STRING, allowNull: false},
	description: Sequelize.STRING,
	startsAt: {type: Sequelize.DATE, allowNull: false},
	endsAt: {type: Sequelize.DATE, allowNull: false},
	venueId: {type: Sequelize.UUID, allowNull: false}
}, {
	timestamps: false,
	validate: {
		endsAfterStarts() {
			if (new Date(this.endsAt) <= new Date(this.startsAt)) {
				throw new Error('endsAt must be after startsAt.');
			}
		}
	}
});

const Participant = sequelize.define('participant', {
	id: id(),
	firstName: {type: Sequelize.STRING, allowNull: false},
	lastName: {type: Sequelize.STRING, allowNull: false},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {isEmail: true}
	}
}, {timestamps: false});

// Tabele de legatura: prima cheie = membrul, a doua = gazda.
const Registration = sequelize.define('registration', {
	participantId: {type: Sequelize.UUID, primaryKey: true},
	eventId: {type: Sequelize.UUID, primaryKey: true}
}, {timestamps: false});

const Presentation = sequelize.define('presentation', {
	speakerId: {type: Sequelize.UUID, primaryKey: true},
	eventId: {type: Sequelize.UUID, primaryKey: true}
}, {timestamps: false});

Venue.hasMany(Event, {foreignKey: 'venueId', onDelete: 'RESTRICT'});
Event.belongsTo(Venue, {foreignKey: 'venueId', onDelete: 'RESTRICT'});
Event.belongsToMany(Participant, {through: Registration, foreignKey: 'eventId', otherKey: 'participantId'});
Participant.belongsToMany(Event, {through: Registration, foreignKey: 'participantId', otherKey: 'eventId'});
Event.belongsToMany(Speaker, {through: Presentation, foreignKey: 'eventId', otherKey: 'speakerId'});
Speaker.belongsToMany(Event, {through: Presentation, foreignKey: 'speakerId', otherKey: 'eventId'});

async function initialize() {
	await sequelize.authenticate();
	await sequelize.sync();
}

export {
	initialize,
	Speaker,
	Venue,
	Event,
	Participant,
	Registration,
	Presentation
};
