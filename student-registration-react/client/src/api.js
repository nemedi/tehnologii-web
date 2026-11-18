const JSON_HEADERS = {'Content-Type': 'application/json'};

export async function getStudents() {
	const response = await fetch('/api/students');
	return response.status === 200 ? await response.json() : [];
}

export async function getStudent(id) {
	const response = await fetch(`/api/students/${id}`);
	return response.status === 200 ? await response.json() : undefined;
}

export async function addStudent(student) {
	const response = await fetch('/api/students', {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify(student)
	});
	return response.status === 201;
}

export async function saveStudent(id, student) {
	const response = await fetch(`/api/students/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(student)
	});
	return response.status === 204;
}

export async function removeStudent(id) {
	const response = await fetch(`/api/students/${id}`, {method: 'DELETE'});
	return response.status === 204;
}
