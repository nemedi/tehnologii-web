// Descrierea resurselor expuse de server. Prima resursa e folosita si la verificarea autentificarii.
// field.ref = cheie straina catre o alta resursa; sub = relatie N:M (member = cheia returnata de GET).
export default {
	title: 'Magazin',
	resources: [
		{
			key: 'products', path: '/products', label: 'Produse', singular: 'produs',
			display: r => r.name,
			fields: [
				{ name: 'name', label: 'Nume', type: 'text', required: true },
				{ name: 'description', label: 'Descriere', type: 'text' },
				{ name: 'price', label: 'Preț', type: 'number', required: true, min: 0, step: 'any' },
				{ name: 'stock', label: 'Stoc', type: 'number', required: true, min: 0 }
			]
		},
		{
			key: 'customers', path: '/customers', label: 'Clienți', singular: 'client',
			display: r => `${r.firstName} ${r.lastName}`,
			fields: [
				{ name: 'firstName', label: 'Prenume', type: 'text', required: true },
				{ name: 'lastName', label: 'Nume', type: 'text', required: true },
				{ name: 'email', label: 'Email', type: 'email', required: true },
				{ name: 'address', label: 'Adresă', type: 'text' }
			]
		},
		{
			key: 'orders', path: '/orders', label: 'Comenzi', singular: 'comandă',
			display: r => `${new Date(r.placedAt).toLocaleString('ro-RO')} (${r.status})`,
			fields: [
				{ name: 'placedAt', label: 'Plasată la', type: 'datetime', required: true },
				{ name: 'status', label: 'Stare', type: 'text', required: true, options: ['NEW', 'PAID', 'SHIPPED', 'CANCELLED'] },
				{ name: 'customerId', label: 'Client', type: 'text', required: true, ref: 'customers' }
			],
			subs: [{ path: 'products', label: 'Produse', target: 'products', member: 'productId' }]
		}
	]
};
