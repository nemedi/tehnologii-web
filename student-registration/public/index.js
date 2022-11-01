window.onload = async function() {
	renderTable();
}

async function renderTable() {
	const response = await fetch('views/table.html');
	const body = await response.text();
	document.querySelector('.container').innerHTML = body;
	document.querySelector('input[type=button]').onclick = () => renderForm();
	const students = await getStudents();
	if (students.length > 0) {
		const template = document.querySelector('tbody').innerHTML;
		const ids = [];
		document.querySelector('tbody').innerHTML =
			students.map(student => {
				let html = template;
				ids.push(student.id);
				Object.entries(student)
					.forEach(([name, value]) =>
						html = html.replace(`$\{${name}\}`, value));
				return html;
			})
			.reduce((html, item) => html += item, '');
		document.querySelector('tfoot').innerHTML = '';
		let index = 0;
		document.querySelectorAll('input[type=button][value=Sterge]')
			.forEach(button => button.onclick = () => removeStudent(ids[index++]));
	} else {
		document.querySelector('tbody').innerHTML = '';
	}
}

async function getStudents() {
	const response = await fetch('students');
	const body = await response.json();
	return body;
}

async function removeStudent(id) {
	const response = await fetch(`students/${id}`, {
		method: 'DELETE'
	});
	if (response.status === 204) {
		renderTable();
	}
}

async function renderForm() {
	const response = await fetch('views/form.html');
	const body = await response.text();
	document.querySelector('.container').innerHTML = body;
	document.querySelector('input[type=button]').onclick = () => renderTable();
}


async function processForm(form) {
	const student = {
		lastName: form['lastName'].value,
		firstName: form['firstName'].value,
		bornDate: form['bornDate'].value,
		email: form['email'].value,
		phone: form['phone'].value,
		section: form['section'].value,
		group: form['group'].value
	};
	const response = await fetch('students', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(student)
	});
	if (response.status === 204) {
		renderTable();
		return true;
	} else {
		return false;
	}
}

