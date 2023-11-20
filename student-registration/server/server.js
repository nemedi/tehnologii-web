const express = require('express');
const {join, resolve} = require('path');
const {
	getRecords: getStudents,
	getRecord: getStudent,
	addRecord: addStudent,
	saveRecord: saveStudent,
	removeRecord: removeStudent}
	= require('./repository')('repository.json');
const port = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve('..'), 'client')))
	.use(express.json())
	.get('/api/students', (request, response) => {
		const students = getStudents();
		if (students.length > 0) {
			response.json(students);
		} else {
			response.sendStatus(204);
		}
	})
	.get('/api/students/:id', (request, response) => {
		const student = getStudent(request.params.id);
		if (student) {
			response.json(student);
		} else {
			response.sendStatus(404);
		}
	})	
	.post('/api/students', (request, response) => {
		const id = addStudent(request.body);
		response.setHeader('Location',
			`${request.protocol}://${request.hostname}${request.path}/${id}`);
		response.sendStatus(201);
	})
	.put('/api/students/:id', (request, response) => {
		if (saveStudent(request.params.id, request.body)) {
			response.sendStatus(204);
		}  else {
			response.sendStatus(404);
		}
	})
	.delete('/api/students/:id', (request, response) => {
		if (removeStudent(request.params.id)) {
			response.sendStatus(204);
		} else {
			response.sendStatus(404);
		}
	})
	.listen(port, () => console.log(`Server is running on port ${port}.`));