// Client HTTP pentru API-ul REST, cu autentificare Basic.
const KEY = 'credentials';
let credentials = sessionStorage.getItem(KEY);
let user = sessionStorage.getItem('user');
let onUnauthorized = () => {};

export const setUnauthorizedHandler = handler => { onUnauthorized = handler; };
export const isLoggedIn = () => credentials !== null;
export const currentUser = () => user;

function encode(username, password) {
	const bytes = new TextEncoder().encode(`${username}:${password}`);
	return 'Basic ' + btoa(String.fromCharCode(...bytes));
}

async function errorFrom(response) {
	let message = `Eroare ${response.status}`;
	try {
		const data = await response.json();
		if (data.error) message = data.error;
		if (data.details?.length) message += ` (${data.details.join('; ')})`;
	} catch { /* corp gol sau non-JSON */ }
	return new Error(message);
}

// Verifica credentialele pe o ruta protejata; le pastreaza doar daca sunt acceptate.
export async function login(username, password, probePath) {
	const authorization = encode(username, password);
	const response = await fetch(`/api${probePath}`, { headers: { Authorization: authorization } });
	if (response.status === 401) {
		throw new Error('Utilizator sau parolă incorecte.');
	}
	if (!response.ok) {
		throw await errorFrom(response);
	}
	credentials = authorization;
	user = username;
	sessionStorage.setItem(KEY, credentials);
	sessionStorage.setItem('user', username);
}

export function logout() {
	credentials = null;
	user = null;
	sessionStorage.removeItem(KEY);
	sessionStorage.removeItem('user');
}

async function request(method, path, body) {
	const headers = { Authorization: credentials };
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	const response = await fetch(`/api${path}`, {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body)
	});
	if (response.status === 401) {
		logout();
		onUnauthorized();
		throw new Error('Sesiunea a expirat.');
	}
	if (!response.ok) {
		throw await errorFrom(response);
	}
	return response;
}

// 204 => lista goala.
export async function list(path) {
	const response = await request('GET', path);
	return response.status === 204 ? [] : response.json();
}

// Returneaza id-ul din antetul Location.
export async function create(path, body) {
	const response = await request('POST', path, body);
	return response.headers.get('Location')?.split('/').pop();
}

export const update = (path, id, body) => request('PUT', `${path}/${id}`, body);
export const remove = (path, id) => request('DELETE', `${path}/${id}`);
export const link = (path, id, sub, key) => request('PUT', `${path}/${id}/${sub}/${key}`);
export const unlink = (path, id, sub, key) => request('DELETE', `${path}/${id}/${sub}/${key}`);
export const listLinks = (path, id, sub) => list(`${path}/${id}/${sub}`);
