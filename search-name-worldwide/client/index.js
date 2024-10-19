window.onload = function() {
	document.querySelector('input[name="name"]').onkeyup = event => searchName(event);
};

function searchName(event) {
	const resultsTag = document.getElementById('results');
	if (event.target.value.trim().length === 0) {
		resultsTag.innerHTML = '';
	} else if (event.key === 'Enter') {
		let method = eval('searchNameUsing'
			+ document.querySelector('input[name="implementation"]:checked').value);
		method(event.target.value.trim(), countries => {
			resultsTag.innerHTML = '<ol>'
				+ countries.map(country => `<li>${country}</li>`).join('')
				+ '</ol>';
		});
	}
}

async function searchNameUsingAsyncAwait(name, callback) {
	const response = await fetch('/names/' + name)
		.catch(error => console.error(error));
	const body = await response.json()
		.catch(error => console.error(error));
	callback(body);
}

function searchNameUsingPromise(name, callback) {
	new Promise((resolve, reject) =>
			fetch('/names/' + name)
				.then(response => response.json(),
					error => reject(error))
				.then(body => resolve(body),
					error => reject(error))
		)
		.then(countries => callback(countries),
			error => console.error(error));
}