function addLanguage(event) {
	if (event.key === 'Enter') {
		const language = event.target.value.trim();
		event.target.parentElement.children[0].innerHTML +=
			`<br><input type="checkbox" name="language" value="${language}" checked>${language}`;
		event.target.value = '';
	}
}

function $(selector, container) {
	return container
		? container.querySelector(selector)
		: document.querySelector(selector);
}

function processForm(form) {
	const firstName = $('[name=firstName]', form).value;
	const lastName = $('[name=lastName]', form).value;
	return true;
}