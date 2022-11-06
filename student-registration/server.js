const express = require('express');
const {join, resolve} = require('path');
const {getStudents, getStudent, addStudent, saveStudent, removeStudent} = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.use(express.json())
	.get('/students', (request, response) => {
		response.json(getStudents());
	})
	.get('/students/:id', (request, response) => {
		response.json(getStudent(request.params.id));
	})	
	.post('/students', (request, response) => {
		addStudent(request.body);
		response.sendStatus(204);
	})
	.put('/students/:id', (request, response) => {
		saveStudent(request.params.id, request.body);
		response.sendStatus(204);
	})
	.delete('/students/:id', (request, response) => {
		removeStudent(request.params.id);
		response.sendStatus(204);
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));