function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
String.prototype.render = function(context) {
	return Object.entries(context).reduce((result, [key, value]) =>
		result.replaceAll('${' + key + '}', value), this)
		.replace(/%{([^}]*)}/g, (match, expression) => eval(expression));
}
function memoizer(method) {
    const cache = {};
    return function() {
        const key = [...arguments].toString();
        if (cache[key] === undefined) {
            cache[key] = method.apply(this, arguments);
        }
        return cache[key];
    };
}
const getView = memoizer(async view =>
	await (await fetch(`/views/${view}.html`)).text()
);
function goTo(path) {
	window.location.href = `#${path}`;
}
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
	$('input[type=button]').onclick = () => goTo('add');
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
	$('input[type=button]').onclick = () => goTo('home');
}
async function processForm(form) {
	const student = emptyStudent();
	Object.keys(student)
		.forEach(key => student[key] = form[key].value);
	const id = student.id;
	delete student.id;
	if (id.length > 0) {
		saveStudent(id, student);
	} else {
		addStudent(student);
	}
}
window.addEventListener('hashchange', event => {
	let index = event.newURL.indexOf('#');
	if (index > -1) {
		event.preventDefault();
		const path = event.newURL.substring(index + 1);
		if (path === 'home') {
			renderTable();		
		} else if (path === 'add') {
			renderForm();
		} else if (path.startsWith('edit/')) {
			renderForm(path.substring('edit/'.length));
		} else if (path.startsWith('remove/')) {
			removeStudent(path.substring('remove/'.length));
		}
	}
});