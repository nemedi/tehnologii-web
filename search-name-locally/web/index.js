const cache = {};
async function searchName(event) {
	if (event.key === 'Enter' && event.target.value.trim().length > 0) {
		const name = event.target.value
		document.getElementById('results').innerHTML = `Searching for <i>${name}</i>, please wait...`;
		const results = cache[name] !== undefined
			? cache[name]
			: await (await fetch(`names/${name}`)).json();
		if (results.length > 0) {
			cache[name] = results;
		}
		document.getElementById('results').innerHTML = results.length > 0 ? 
			'<ol>'
				+ results.map(result => `<li>${result.district}: ${result.count}</li>`)
					.reduce((html, item) => html += item, '')
				+ '</ol>'
			: `No results found for ${name}.`;
	} else {
		document.getElementById('results').innerHTML = '';
	}
}