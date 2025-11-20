const express = require('express');
const {
	getRecords: getNotes,
	getRecord: getNote,
	addRecord: addNote,
	saveRecord: saveNote,
	removeRecord: removeNote}
	= require('./repository')('repository.json');
const PORT = 8080;
express()
	.use(express.static('../client'))
	.use(express.urlencoded({extended: true}))
	.use(express.json())
	.get('/api/notes', (request, response) => {
		const notes = getNotes();
		if (notes.length > 0) {
			response.json(notes);
		} else {
			response.sendStatus(204);
		}
	})
	.get('/api/notes/:id', (request, response) => {
		const note = getNote(request.params.id);
		if (note) {
			response.json(note);
		} else {
			response.sendStatus(404);
		}
	})	
	.post('/api/notes', (request, response) => {
		const id = addNote(request.body);
		response.setHeader('Location',
			`${request.protocol}://${request.hostname}:${request.socket.localPort}${request.path}/${id}`);
		response.sendStatus(201);
	})
	.put('/api/notes/:id', (request, response) =>
		response.sendStatus(saveNote(request.params.id, request.body) ? 204 : 404)
	)
	.delete('/api/notes/:id', (request, response) => 
		response.sendStatus(removeNote(request.params.id) ? 204 : 404)
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));