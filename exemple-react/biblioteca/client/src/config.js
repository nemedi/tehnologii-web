// Descrierea resurselor expuse de server. Prima resursa e folosita si la verificarea autentificarii.
// field.ref = cheie straina catre o alta resursa; sub = relatie N:M (member = cheia returnata de GET).
export default {
	title: 'Bibliotecă',
	resources: [
		{
			key: 'books', path: '/books', label: 'Cărți', singular: 'carte',
			display: r => r.title,
			fields: [
				{ name: 'title', label: 'Titlu', type: 'text', required: true },
				{ name: 'isbn', label: 'ISBN (13 caractere)', type: 'text', required: true, length: 13 },
				{ name: 'publishedOn', label: 'Publicată la', type: 'date' },
				{ name: 'pages', label: 'Pagini', type: 'number', required: true, min: 1 },
				{ name: 'authorId', label: 'Autor', type: 'text', required: true, ref: 'authors' }
			],
			subs: [{ path: 'categories', label: 'Categorii', target: 'categories', member: 'categoryId' }]
		},
		{
			key: 'authors', path: '/authors', label: 'Autori', singular: 'autor',
			display: r => `${r.firstName} ${r.lastName}`,
			fields: [
				{ name: 'firstName', label: 'Prenume', type: 'text', required: true },
				{ name: 'lastName', label: 'Nume', type: 'text', required: true },
				{ name: 'birthYear', label: 'An naștere', type: 'number', min: 1000 },
				{ name: 'country', label: 'Țara', type: 'text' }
			]
		},
		{
			key: 'readers', path: '/readers', label: 'Cititori', singular: 'cititor',
			display: r => r.name,
			fields: [
				{ name: 'name', label: 'Nume', type: 'text', required: true },
				{ name: 'email', label: 'Email', type: 'email', required: true },
				{ name: 'phone', label: 'Telefon', type: 'text' }
			]
		},
		{
			key: 'loans', path: '/loans', label: 'Împrumuturi', singular: 'împrumut',
			display: r => `${r.borrowedOn} → ${r.dueOn}`,
			fields: [
				{ name: 'bookId', label: 'Carte', type: 'text', required: true, ref: 'books' },
				{ name: 'readerId', label: 'Cititor', type: 'text', required: true, ref: 'readers' },
				{ name: 'borrowedOn', label: 'Împrumutat la', type: 'date', required: true },
				{ name: 'dueOn', label: 'Scadent la', type: 'date', required: true },
				{ name: 'returnedOn', label: 'Returnat la', type: 'date' }
			]
		},
		{
			key: 'categories', path: '/categories', label: 'Categorii', singular: 'categorie',
			display: r => r.name,
			fields: [
				{ name: 'name', label: 'Nume', type: 'text', required: true },
				{ name: 'description', label: 'Descriere', type: 'text' }
			]
		}
	]
};
