const express = require('express');
const {getTasks, addTask, removeTask} = require('./service')('repository.json');
const PORT = process.env.PORT || 8080;
express()
	.use(express.urlencoded({extended: true}))
	.use(express.json())
	.use(express.static('../client'))
	.get('/tasks', (request, response) => {
		response.json({
			title: 'Tasks',
			tasks: getTasks()
		});
	})
	.post('/tasks', (request, response) => {
		response.json(addTask(request.body.task));
	})
	.delete('/tasks/:id', (request, response) => {
		if (removeTask(request.params.id)) {
			response.sendStatus(204);
		} else {
			response.sendStatus(404);
		}
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));