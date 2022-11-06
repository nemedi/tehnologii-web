window.onload = () => renderTable();

async function renderTable() {
	const response = await fetch('/views/table.html');
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
		const editButtons = document.querySelectorAll('input[type=button][value=Editeaza]');
		const deleteButtons = document.querySelectorAll('input[type=button][value=Sterge]');
		for (let i = 0; i < ids.length; i++) {
			editButtons[i].onclick = () => renderForm(ids[i]);
			deleteButtons[i].onclick = () => removeStudent(ids[i]);
		}
	} else {
		document.querySelector('tbody').innerHTML = '';
	}
}

async function getStudents() {
	const response = await fetch('/students');
	const body = await response.json();
	return body;
}

async function getStudent(id) {
	const response = await fetch(`/students/${id}`);
	const body = await response.json();
	return body;
}

async function removeStudent(id) {
	const response = await fetch(`/students/${id}`, {
		method: 'DELETE'
	});
	if (response.status === 204) {
		renderTable();
	}
}

async function renderForm(id) {
	const response = await fetch('/views/form.html');
	const body = await response.text();
	document.querySelector('.container').innerHTML = body;
	document.querySelector('form').onsubmit = (event) => processForm(event.target);
	document.querySelector('input[type=button]').onclick = () => renderTable();
	if (id) {
		const student = await getStudent(id);
		document.querySelector(`input[type=hidden][name=id]`).value = id;
		Object.entries(student)
			.forEach(([name, value]) => {
				const input = document.querySelector(`input[name=${name}]`);
				if (input) {
					input.value = value;
				} else {
					const select = document.querySelector(`select[name=${name}]`);
					if (select) {
						select.options.forEach(option => {
							if (option.value === value) {
								option.selected = true;
							}
						});
					}
				}
			});
	}
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
	const response = id.length > 0 ?
		await fetch(`/students/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(student)
		})
		: await fetch('/students', {
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

