import express from 'express';
import {Author, Book, Reader, Loan, Category, BookCategory} from './repository.mjs';
import {
	getRecords,
	getRecord,
	checkRecord,
	createRecord,
	changeRecord,
	modifyRecord,
	removeRecords,
	removeRecord,
	getSubrecords,
	removeSubrecords,
	addSubrecord,
	removeSubrecord
} from './service.mjs';

const router = express.Router();

// Leaga rutele CRUD standard de handler-ele generice pentru un model.
function resource(path, Model) {
	router.route(path)
		.get((request, response) => getRecords(Model, request, response))
		.post((request, response) => createRecord(Model, request, response))
		.delete((request, response) => removeRecords(Model, request, response));
	router.route(`${path}/:id`)
		.get((request, response) => getRecord(Model, request, response))
		.head((request, response) => checkRecord(Model, request, response))
		.put((request, response) => changeRecord(Model, request, response))
		.patch((request, response) => modifyRecord(Model, request, response))
		.delete((request, response) => removeRecord(Model, request, response));
}

// Leaga rutele unei subresurse N:M peste un model de legatura.
function subresource(path, Submodel) {
	router.route(path)
		.get((request, response) => getSubrecords(Submodel, request, response))
		.delete((request, response) => removeSubrecords(Submodel, request, response));
	router.route(`${path}/:key`)
		.put((request, response) => addSubrecord(Submodel, request, response))
		.delete((request, response) => removeSubrecord(Submodel, request, response));
}

resource('/authors', Author);
resource('/books', Book);
resource('/readers', Reader);
resource('/loans', Loan);
resource('/categories', Category);
subresource('/books/:id/categories', BookCategory);

export default router;
