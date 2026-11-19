// Descrierea resurselor expuse de server. Prima resursa e folosita si la verificarea autentificarii.
// field.ref = cheie straina catre o alta resursa; sub = relatie N:M (member = cheia returnata de GET).
export default {
	title: 'Evenimente',
	resources: [
		{
			key: 'events', path: '/events', label: 'Evenimente', singular: 'eveniment',
			display: r => r.title,
			fields: [
				{ name: 'title', label: 'Titlu', type: 'text', required: true },
				{ name: 'description', label: 'Descriere', type: 'text' },
				{ name: 'startsAt', label: 'Început', type: 'datetime', required: true },
				{ name: 'endsAt', label: 'Sfârșit', type: 'datetime', required: true },
				{ name: 'venueId', label: 'Locație', type: 'text', required: true, ref: 'venues' }
			],
			subs: [
				{ path: 'participants', label: 'Participanți înscriși', target: 'participants', member: 'participantId' },
				{ path: 'speakers', label: 'Vorbitori', target: 'speakers', member: 'speakerId' }
			]
		},
		{
			key: 'speakers', path: '/speakers', label: 'Vorbitori', singular: 'vorbitor',
			display: r => r.name,
			fields: [
				{ name: 'name', label: 'Nume', type: 'text', required: true },
				{ name: 'company', label: 'Companie', type: 'text' },
				{ name: 'email', label: 'Email', type: 'email', required: true }
			]
		},
		{
			key: 'venues', path: '/venues', label: 'Locații', singular: 'locație',
			display: r => `${r.name} (${r.city})`,
			fields: [
				{ name: 'name', label: 'Nume', type: 'text', required: true },
				{ name: 'city', label: 'Oraș', type: 'text', required: true },
				{ name: 'seats', label: 'Locuri', type: 'number', required: true, min: 1 }
			]
		},
		{
			key: 'participants', path: '/participants', label: 'Participanți', singular: 'participant',
			display: r => `${r.firstName} ${r.lastName}`,
			fields: [
				{ name: 'firstName', label: 'Prenume', type: 'text', required: true },
				{ name: 'lastName', label: 'Nume', type: 'text', required: true },
				{ name: 'email', label: 'Email', type: 'email', required: true }
			]
		}
	]
};
