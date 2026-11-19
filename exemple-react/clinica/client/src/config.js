// Descrierea resurselor expuse de server. Prima resursa e folosita si la verificarea autentificarii.
// field.ref = cheie straina catre o alta resursa; sub = relatie N:M (member = cheia returnata de GET).
export default {
	title: 'Clinică',
	resources: [
		{
			key: 'appointments', path: '/appointments', label: 'Programări', singular: 'programare',
			display: r => new Date(r.scheduledAt).toLocaleString('ro-RO'),
			fields: [
				{ name: 'scheduledAt', label: 'Data și ora', type: 'datetime', required: true },
				{ name: 'durationMinutes', label: 'Durată (minute)', type: 'number', required: true, min: 5 },
				{ name: 'doctorId', label: 'Medic', type: 'text', required: true, ref: 'doctors' },
				{ name: 'patientId', label: 'Pacient', type: 'text', required: true, ref: 'patients' },
				{ name: 'notes', label: 'Observații', type: 'text' }
			],
			subs: [{ path: 'treatments', label: 'Tratamente', target: 'treatments', member: 'treatmentId' }]
		},
		{
			key: 'doctors', path: '/doctors', label: 'Medici', singular: 'medic',
			display: r => `${r.firstName} ${r.lastName}`,
			fields: [
				{ name: 'firstName', label: 'Prenume', type: 'text', required: true },
				{ name: 'lastName', label: 'Nume', type: 'text', required: true },
				{ name: 'specialty', label: 'Specialitate', type: 'text', required: true },
				{ name: 'licenseNumber', label: 'Număr licență', type: 'text', required: true }
			]
		},
		{
			key: 'patients', path: '/patients', label: 'Pacienți', singular: 'pacient',
			display: r => `${r.firstName} ${r.lastName}`,
			fields: [
				{ name: 'firstName', label: 'Prenume', type: 'text', required: true },
				{ name: 'lastName', label: 'Nume', type: 'text', required: true },
				{ name: 'birthDate', label: 'Data nașterii', type: 'date', required: true },
				{ name: 'email', label: 'Email', type: 'email' },
				{ name: 'phone', label: 'Telefon', type: 'text' }
			]
		},
		{
			key: 'treatments', path: '/treatments', label: 'Tratamente', singular: 'tratament',
			display: r => r.name,
			fields: [
				{ name: 'name', label: 'Nume', type: 'text', required: true },
				{ name: 'description', label: 'Descriere', type: 'text' },
				{ name: 'price', label: 'Preț', type: 'number', required: true, min: 0, step: 'any' }
			]
		}
	]
};
