window.onload = () => {
	const output = document.getElementById('results');
	document.getElementById('url').onkeyup = async event => {
		if (event.key === 'Enter'
			&& event.target.value.trim().length > 0) {
			const url = event.target.value.trim();
			output.innerHTML = `Searching links from <b>${url}</b>...`;
			const response = await fetch(`/links?url=${url}`);
			const body = await response.json();
			output.innerHTML = body.length > 0
				? '<ol>'
					+ body.map(link => `<li><a href="${link}" target="_blank">${link}</li>`)
						.reduce((item, html) => html += item, '')
					+ '</ol>'
				: '';
		} else {
			output.innerHTML = '';
		}
	};
}
