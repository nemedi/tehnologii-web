const express = require('express');
const {join, resolve} = require('path');
const uuid = require('uuid');

const PORT = process.env.PORT || 8080;

const application = express();
application.locals.tasks = [];
application
	.use(express.urlencoded({extended: true}))
	.use(express.json())
	.use(express.static(join(resolve(), 'public')))
	.get('/tasks', (request, response) => {
		response.json({
			title: 'Tasks',
			tasks: application.locals.tasks
		});
	})
	.post('/tasks', (request, response) => {
		const task = {id: uuid.v1(), description: request.body.task};
		application.locals.tasks.push(task);
		response.json(task);
	})
	.delete('/tasks/:id', (request, response) => {
		let index = application.locals.tasks.findIndex(task => task.id === request.params.id);
		application.locals.tasks.splice(index, 1);
		response.status(200);
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));