function addLanguage(event) {
	if (event.key === 'Enter') {
		const language = event.target.value.trim();
		event.target.parentElement.children[0].innerHTML +=
			`<br><input type="checkbox" name="language" value="${language}" checked>${language}`;
		event.target.value = '';
	}
}

function processForm(form) {
	const firstName = form['firstName'].value;
	const lastName = form['lastName'].value;
	const email = form['email'].value;
	const gender = form['gender'].value;
	return true;
}