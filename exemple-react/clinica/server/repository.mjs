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

const Doctor = sequelize.define('doctor', {
	id: id(),
	firstName: {type: Sequelize.STRING, allowNull: false},
	lastName: {type: Sequelize.STRING, allowNull: false},
	specialty: {type: Sequelize.STRING, allowNull: false},
	licenseNumber: {type: Sequelize.STRING, allowNull: false}
}, {timestamps: false});

const Patient = sequelize.define('patient', {
	id: id(),
	firstName: {type: Sequelize.STRING, allowNull: false},
	lastName: {type: Sequelize.STRING, allowNull: false},
	birthDate: {type: Sequelize.DATEONLY, allowNull: false},
	email: {
		type: Sequelize.STRING,
		validate: {isEmail: true}
	},
	phone: Sequelize.STRING
}, {timestamps: false});

const Appointment = sequelize.define('appointment', {
	id: id(),
	scheduledAt: {type: Sequelize.DATE, allowNull: false},
	durationMinutes: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {min: 5}
	},
	notes: Sequelize.STRING,
	doctorId: {type: Sequelize.UUID, allowNull: false},
	patientId: {type: Sequelize.UUID, allowNull: false}
}, {timestamps: false});

const Treatment = sequelize.define('treatment', {
	id: id(),
	name: {type: Sequelize.STRING, allowNull: false},
	description: Sequelize.STRING,
	price: {
		type: Sequelize.DECIMAL(10, 2),
		allowNull: false,
		validate: {min: 0}
	}
}, {timestamps: false});

// Tabel de legatura: prima cheie = membrul, a doua = gazda.
const AppointmentTreatment = sequelize.define('appointmentTreatment', {
	treatmentId: {type: Sequelize.UUID, primaryKey: true},
	appointmentId: {type: Sequelize.UUID, primaryKey: true}
}, {timestamps: false});

Doctor.hasMany(Appointment, {foreignKey: 'doctorId', onDelete: 'RESTRICT'});
Appointment.belongsTo(Doctor, {foreignKey: 'doctorId', onDelete: 'RESTRICT'});
Patient.hasMany(Appointment, {foreignKey: 'patientId', onDelete: 'RESTRICT'});
Appointment.belongsTo(Patient, {foreignKey: 'patientId', onDelete: 'RESTRICT'});
Appointment.belongsToMany(Treatment, {through: AppointmentTreatment, foreignKey: 'appointmentId', otherKey: 'treatmentId'});
Treatment.belongsToMany(Appointment, {through: AppointmentTreatment, foreignKey: 'treatmentId', otherKey: 'appointmentId'});

async function initialize() {
	await sequelize.authenticate();
	await sequelize.sync();
}

export {
	initialize,
	Doctor,
	Patient,
	Appointment,
	Treatment,
	AppointmentTreatment
};
