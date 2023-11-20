async function getStudents() {
	const response = await fetch('/api/students');
	if (response.status === 200) {
		return await response.json();
	} else {
		return [];
	}
}
async function getStudent(id) {
	const response = await fetch(`/api/students/${id}`);
	if (response.status === 200) {
		return await response.json();
	}
}
async function addStudent(student) {
	const response = await fetch('/api/students', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(student)
	});
	if (response.status === 201) {
		goTo('home');
	}
}
async function saveStudent(id, student) {
	const response = await fetch(`/api/students/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(student)
	});
	if (response.status === 204) {
		goTo('home');
	}
}
async function removeStudent(id) {
	const response = await fetch(`/api/students/${id}`, {
		method: 'DELETE'
	});
	if (response.status === 204) {
		goTo('home');
	}
}
async function renderTable() {
	const view = await getView('table');
	const students = await getStudents();
	$('.container').innerHTML =
		view.render({students, noStudents: students.length === 0});
}
async function renderForm(id) {
	const student = id ? await getStudent(id) : {};
	const view = await getView('form');
	$('.container').innerHTML = view.render({...student,  existing: id !== undefined});
}
async function processForm(form) {
	const student = {};
	['id', 'firstName', 'lastName', 'bornDate', 'email', 'phone', 'section', 'group']
		.forEach(key => student[key] = form[key].value);
	const id = student.id;
	delete student.id;
	if (id.length > 0) {
		saveStudent(id, student);
	} else {
		addStudent(student);
	}
}
router({
	'home': () => renderTable(),
	'add': () => renderForm(),
	'edit/:id': ({id}) => renderForm(id),
	'remove/:id': ({id}) => removeStudent(id)
});
window.onload = () => goTo('home');