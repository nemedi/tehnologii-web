import express from 'express';
import {Room, Contact, Meeting, Attendee} from './repository.mjs';
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

router.route('/rooms')
 	.get(async (request, response) => getRecords(Room, request, response))
	.post(async (request, response) => createRecord(Room, request, response))
	.delete(async (request, response) => removeRecords(Room, request, response));

router.route('/rooms/:id')
	.get(async (request, response) => getRecord(Room, request, response))
	.head(async (request, response) => checkRecord(Room, request, response))
	.put(async (request, response) => changeRecord(Room, request, response))
	.patch(async (request, response) => modifyRecord(Room, request, response))
	.delete(async (request, response) => removeRecord(Room, request, response));

router.route('/contacts')
	.get(async (request, response) => getRecords(Contact, request, response))
	.post(async (request, response) => createRecord(Contact, request, response))
	.delete(async (request, response) => removeRecords(Contact, request, response));

router.route('/contacts/:id')
	.get(async (request, response) => getRecord(Contact, request, response))
	.head(async (request, response) => checkRecord(Contact, request, response))
	.put(async (request, response) => changeRecord(Contact, request, response))
	.patch(async (request, response) => modifyRecord(Contact, request, response))
	.delete(async (request, response) => removeRecord(Contact, request, response));

router.route('/meetings')
	.get(async (request, response) => getRecords(Meeting, request, response))
	.post(async (request, response) => createRecord(Meeting, request, response))
	.delete(async (request, response) => removeRecords(Meeting, request, response));

router.route('/meetings/:id')
	.get(async (request, response) => getRecord(Meeting, request, response))
	.head(async (request, response) => checkRecord(Meeting, request, response))
	.put(async (request, response) => changeRecord(Meeting, request, response))
	.delete(async (request, response) => removeRecord(Meeting, request, response));

router.route('/meetings/:id/attendees')
	.get(async (request, response) => getSubrecords(Attendee, request, response))
	.delete(async (request, response) => removeSubrecords(Attendee, request, response));

router.route('/meetings/:id/attendees/:key')
	.put(async (request, response) => addSubrecord(Attendee, request, response))
	.delete(async (request, response) => removeSubrecord(Attendee, request, response));

export default router;