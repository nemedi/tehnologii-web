const express = require('express');
const {join, resolve} = require('path');
const {getStudents, getStudent, addStudent, removeStudent} = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.use(express.json())
	.get('/students', async (request, response) => {
		response.json(await getStudents());
	})
	.get('/students/:id', async (request, response) => {
		response.json(await getStudent(request.params.id));
	})	
	.post('/students', async (request, response) => {
		await addStudent(request.body);
		response.sendStatus(204);
	})
	.delete('/students/:id', async (request, response) => {
		await removeStudent(request.params.id);
		response.sendStatus(204);
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));