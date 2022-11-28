const express = require('express');
const session = require('express-session');
const uuid = require('uuid');

const PORT = process.env.PORT || 8080;

const checkSession = request => {
	if (!request.session.tasks) {
		request.session.tasks = [];
	}
};

express()
	.use(express.urlencoded({extended: true}))
	.set('view engine', 'pug')
	.use(session({
		secret: 'no secret at all',
		resave: false,
		saveUninitialized: true
	}))
	.get('/', (request, response) => {
		checkSession(request);
		response.render('index', {title : 'Tasks', tasks : request.session.tasks});
	})
	.post('/add-task', (request, response) => {
		checkSession(request);
		request.session.tasks.push({id: uuid.v1(), description: request.body.task});
		response.redirect('/');
	})
	.get('/remove-task/:id', (request, response) => {
		checkSession(request);
		let index = request.session.tasks.findIndex(task => task.id === request.params.id);
		request.session.tasks.splice(index, 1);
		response.redirect('/');
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));