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
window.onload = () => renderTable();
async function renderTable() {
	const view = await getView('table');
	$('.container').innerHTML = view;
	$('input[type=button]').onclick = () => goTo('add');
	const students = await getStudents();
	if (students.length > 0) {
		const ids = students.map(student => student.id);
		const _ = $('tbody').innerHTML;
		$('tbody').innerHTML = students.map(student => _.render(student)).join('');
		$('tfoot').innerHTML = '';
		const editButtons = $$('input[type=button][value=Editeaza]');
		const deleteButtons = $$('input[type=button][value=Sterge]');
		ids.forEach((id, index) => {
			editButtons[index].onclick = () => goTo(`edit/${id}`);
			deleteButtons[index].onclick = () => goTo(`remove/${id}`);
		});
	} else {
		$('tbody').innerHTML = '';
	}
}

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

async function renderForm(id) {
	const student = id
		? await getStudent(id)
		: {
			id: '',
			firstName: '',
			lastName: '',
			bornDate: '',
			email: '',
			phone: '',
			section: '',
			group: ''
		};
	const view = await getView('form');
	$('.container').innerHTML = view.render(student);
	$('form').onsubmit = (event) => processForm(event.target);
	$('input[type=button]').onclick = () => goTo('home');
}

async function processForm(form) {
	const id = form['id'].value;
	const student = {
		lastName: form['lastName'].value,
		firstName: form['firstName'].value,
		bornDate: form['bornDate'].value,
		email: form['email'].value,
		phone: form['phone'].value,
		section: form['section'].value,
		group: form['group'].value
	};
	if (id.length > 0) {
		saveStudent(id, student);
	} else {
		addStudent(student);
	}
}
function goTo(path) {
	window.location.href = `#${path}`;
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