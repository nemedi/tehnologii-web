const express = require('express');
const {getTasks, addTask, removeTask} = require('./service')('repository.json');
const port = process.env.port || 8080;
express()
	.use(express.urlencoded({extended: true}))
	.set('view engine', 'pug')
	.get('/', (request, response) => {
		response.render('index', {title : 'Tasks', tasks : getTasks()});
	})
	.post('/add-task', (request, response) => {
		addTask(request.body.task);
		response.redirect('/');
	})
	.get('/remove-task/:id', (request, response) => {
		if (removeTask(request.params.id)) {
			response.redirect('/');
		}
	})
	.listen(port, () => console.log(`Server is running on port ${port}.`));