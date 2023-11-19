window.onload = () => goTo('home');
async function getStudents() {
	const response = await fetch('/api/students');
	if (response.status === 200) {
		return await response.json();
	} else {
		return [];
	}
}
function emptyStudent() {
	return {
		id: '',
		firstName: '',
		lastName: '',
		bornDate: '',
		email: '',
		phone: '',
		section: '',
		group: ''
	};
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
	$('.container').innerHTML = view;
	$('input[type=button][value=Adauga]').onclick = () => goTo('add');
	const students = await getStudents();
	if (students.length > 0) {
		const _ = $('tbody').innerHTML;
		$('tbody').innerHTML = students.map(student => _.render(student)).join('');
		$('tfoot').innerHTML = '';
		const editButtons = $$('input[type=button][value=Editeaza]');
		const deleteButtons = $$('input[type=button][value=Sterge]');
		students.forEach((student, index) => {
			editButtons[index].onclick = () => goTo(`edit/${student.id}`);
			deleteButtons[index].onclick = () => goTo(`remove/${student.id}`);
		});
	} else {
		$('tbody').innerHTML = '';
	}
}
async function renderForm(id) {
	const student = id
		? await getStudent(id)
		: emptyStudent();
	const view = await getView('form');
	$('.container').innerHTML = view.render(student);
	$('form').onsubmit = event => processForm(event.target);
	$('input[type=button][value=Renunta]').onclick = () => goTo('home');
}
async function processForm(form) {
	const student = emptyStudent();
	Object.keys(student)
		.forEach(key => student[key] = form[key].value);
	if (student.id.length > 0) {
		saveStudent(student.id, student);
	} else {
		delete student.id;
		addStudent(student);
	}
}
router({
	'home': () => renderTable(),
	'add': () => renderForm(),
	'edit/:id' : ({id}) => renderForm(id),
	'remove/:id' : ({id}) => removeStudent(id)
});