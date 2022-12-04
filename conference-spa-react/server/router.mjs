import express from 'express';
import {
	getRooms, getRoom, addRoom, saveRoom, removeRoom,
	getSpeakers, getSpeaker, addSpeaker, saveSpeaker, removeSpeaker,
	getSessions, getSession, addSession, saveSession, removeSession
} from './service.mjs';

const router = express.Router();

router.route('/rooms')
	.get((request, response) => getRooms(request, response))
	.post((request, response) => addRoom(request, response));

router.route('/rooms/:id')
	.get((request, response) => getRoom(request, response))
	.patch((request, response) => saveRoom(request, response))
	.delete((request, response) => removeRoom(request, response));

router.route('/speakers')
	.get((request, response) => getSpeakers(request, response))
	.post((request, response) => addSpeaker(request, response));

router.route('/speakers/:id')
	.get((request, response) => getSpeaker(request, response))
	.patch((request, response) => saveSpeaker(request, response))
	.delete((request, response) => removeSpeaker(request, response));

router.route('/sessions')
	.get((request, response) => getSessions(request, response))
	.post((request, response) => addSession(request, response));

router.route('/sessions/:id')
	.get((request, response) => getSession(request, response))
	.patch((request, response) => saveSession(request, response))
	.delete((request, response) => removeSession(request, response));

export default router;