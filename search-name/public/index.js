async function searchName(event) {
	if (event.keyCode === 13 && event.target.value.length > 0) {
		const name = event.target.value
		document.getElementById('results').innerHTML = `Searching for <i>${name}</i>, please wait...`;
		const items = await (await fetch(`names/${name}`)).json();
		document.getElementById('results').innerHTML = items.length > 0 ? 
			'<ol>'
				+ items.map(item => `<li>${item.district}: ${item.count}</li>`)
					.reduce((output, row) => output += row, '')
				+ '</ol>'
			: `No result found for ${name}.`;
	}
}