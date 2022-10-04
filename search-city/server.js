const express = require('express');
const {join, resolve} = require('path');
const {DataReader} = require('buffered-reader');
const locals = {};
const PORT = process.env.PORT || 8080;
function initialize(file) {
	const readLines = file => {
		const lines = [];
		return new Promise((resolve, reject) => {
			new DataReader(file, {encoding: 'utf8'})
				.on('line', line => lines.push(line))
				.on('error', error => reject(error))
				.on('end', () => resolve(lines))
				.read();
		});
	};
	readLines(file)
		.then(
			lines => locals.cities = lines.map(line => {
				let parts = line.split(',');
				return {
					name: parts[1],
					district: parts[2],
					inhabitants: parts[3]
				};
			})
		);
}
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/cities/:name', (request, response) => {
		let results = locals.cities.filter(city =>
			city.name.toLowerCase().startsWith(request.params.name.toLowerCase()))
			.sort((first, second) =>
				first.name === second.name ? 0 : (first.name < second.name ? -1 : 1));
		response.json(results);
	})
	.listen(PORT, () => {
		try {
			initialize('cities.csv');
		} catch (error) {
			console.log(error);
		}
	});