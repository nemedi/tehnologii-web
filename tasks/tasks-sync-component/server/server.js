const express = require('express');
const {getTasks, addTask, removeTask} = require('./service')('repository.json');
const PORT = process.env.PORT || 8080;
express()
	.use(express.urlencoded({extended: true}))
	.use(express.static('../client'))
	.get('/get-tasks', (request, response) => {
		response.send(`${request.query.callback}({
			title: "Tasks",
			tasks: ${JSON.stringify(getTasks())}
		})`);
	})
	.post('/add-task', (request, response) => {
		addTask(request.body.task);
		response.redirect('/index.html');
	})
	.get('/remove-task/:id', (request, response) => {
		if (removeTask(request.params.id)) {
			response.redirect('/index.html');
		}
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));