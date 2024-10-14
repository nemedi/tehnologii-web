const {DataReader} = require('buffered-reader');
const fs = require('fs');
const csv = require('csv-parser');
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
		lines => 
			locals.cities = lines.map(line => {
				var data = line.split(',');
				return {
					name: data[1],
					district: data[2],
					inhabitants: parseInt(data[3])
				};
			})
		,
		error => console.log(error));
}
express()
	.use(express.static('./client'))
	.get('/cities.json', (request, response) => response.json(locals.cities))
	.listen(PORT, () => {
		try {
			initialize('cities.csv');
			console.log(`Server is ruinning on port ${PORT}.`);
		} catch (error) {
			console.error(error);
		}
	});