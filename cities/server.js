const {DataReader} = require('buffered-reader');
const express = require('express');
const locals = {};
const PORT = process.env.PORT || 8080;
function initialize(file) {
	function readLines(file) {
		const lines = [];
		return new Promise((resolve, reject) => 
			new DataReader(file, {encoding: 'utf8'})
			.on('error', error => reject(error))
			.on('line', line => lines.push(line))
			.on('end', () => resolve(lines))
			.read()
		);
	};
	readLines(file).then(
		lines => {
			locals.cities = lines.map(line => {
				var segments = line.split(',');
				return {
					name: segments[1],
					district: segments[2],
					inhabitants: parseInt(segments[3])
				};
			});
			locals.districts = locals.cities.reduce((items, city) => {
				const district = items.find(item => item.name === city.district);
				if (district) {
					district.inhabitants += city.inhabitants;
				} else {
					items.push({name: city.district, inhabitants: city.inhabitants});
				}
				return items;
			}, []);
		},
		error => console.log(error));
}
express()
	.use(express.static('./client'))
	.get('/cities.json', async (request, response) => response.json(locals.cities))
	.get('/districts.json', async (request, response) => response.json(locals.districts))
	.listen(PORT, () => {
		try {
			initialize('cities.csv');
			console.log(`Server is ruinning on port ${PORT}.`);
		} catch (error) {
			console.error(error);
		}
	});