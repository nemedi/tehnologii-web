const {config} = require('dotenv');
const express = require('express');
const {
	getRecords: getStudents,
	getRecord: getStudent,
	addRecord: addStudent,
	saveRecord: saveStudent,
	removeRecord: removeStudent
} = require('./service');
config();
const port = process.env.PORT || 8080;

// Turns rejected promises (e.g. validation errors) into HTTP responses.
const handle = action => async (request, response) => {
	try {
		await action(request, response);
	} catch (error) {
		if (error.name?.startsWith('SequelizeValidation')) {
			response.status(400).json({errors: error.errors.map(e => e.message)});
		} else {
			console.error(error);
			response.sendStatus(500);
		}
	}
};

express()
	.use(express.static('../dist'))
	.use(express.json())
	.get('/api/students', handle(async (request, response) => {
		const students = await getStudents();
		if (students.length > 0) {
			response.json(students);
		} else {
			response.sendStatus(204);
		}
	}))
	.get('/api/students/:id', handle(async (request, response) => {
		const student = await getStudent(request.params.id);
		if (student) {
			response.json(student);
		} else {
			response.sendStatus(404);
		}
	}))
	.post('/api/students', handle(async (request, response) => {
		const id = await addStudent(request.body);
		response.setHeader('Location',
			`${request.protocol}://${request.hostname}:${request.socket.localPort}${request.path}/${id}`);
		response.sendStatus(201);
	}))
	.put('/api/students/:id', handle(async (request, response) => {
		response.sendStatus(await saveStudent(request.params.id, request.body) ? 204 : 404);
	}))
	.delete('/api/students/:id', handle(async (request, response) => {
		response.sendStatus(await removeStudent(request.params.id) ? 204 : 404);
	}))
	.listen(port, () => console.log(`Server is running on port ${port}.`));
