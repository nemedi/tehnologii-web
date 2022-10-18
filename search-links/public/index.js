async function searchLinks(event) {
	if (event.keyCode === 13
		&& event.target.value.trim().length > 0) {
		const url = event.target.value.trim();
		const response = await fetch(`/links?url=${url}`);
		const body = await response.json();
		document.getElementById('links').innerHTML = body.length > 0
			? body.map(link => `<li><a href="${link}" target="_blank">${link}</li>`)
				.reduce((item, html) => html += item, '')
			: '';
	}
}