import Sequelize from 'sequelize';
import { Room, Speaker, Session } from './repository.mjs';

async function getRooms(request, response) {
	try {
		const rooms = await Room.findAll();
		if (rooms.length > 0) {
			response.status(200).json(rooms);
		} else {
			response.status(204).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function getRoom(request, response) {
	try {
		if (request.params.id) {
			const room = await Room.findByPk(request.params.id);
			if (room) {
				response.json(room);
			} else {
				response.status(404).send();
			}
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function addRoom(request, response) {
	try {
		if (request.body.name
			&& request.body.capacity) {
			await Room.create(request.body);
			response.status(201).send();
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function saveRoom(request, response) {
	try {
		const room = await Room.findByPk(request.params.id);
		if (room) {
			Object.entries(request.body).forEach(([name, value]) => room[name] = value);
			await room.save();
			response.status(204).send();
		} else {
			response.status(404).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function removeRoom(request, response) {
	try {
		if (request.params.id) {
			const room = await Room.findByPk(request.params.id);
			if (room) {
				await room.destroy();
				response.status(204).send();
			} else {
				response.status(404).send();
			}
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function getSpeakers(request, response) {
	try {
		const speakers = await Speaker.findAll({attributes: ['id', 'firstName', 'lastName']});
		if (speakers.length > 0) {
			response.status(200).json(speakers);
		} else {
			response.status(204).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function getSpeaker(request, response) {
	try {
		if (request.params.id) {
			const speaker = await Speaker.findByPk(request.params.id);
			if (speaker) {
				response.json(speaker);
			} else {
				response.status(404).send();
			}
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function addSpeaker(request, response) {
	try {
		if (request.body.firstName
			&& request.body.lastName
			&& request.body.affiliation) {
			await Speaker.create(request.body);
			response.status(201).send();
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function saveSpeaker(request, response) {
	try {
		const speaker = await Speaker.findByPk(request.params.id);
		if (speaker) {
			Object.entries(request.body).forEach(([name, value]) => speaker[name] = value);
			await speaker.save();
			response.status(204).send();
		} else {
			response.status(404).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function removeSpeaker(request, response) {
	try {
		if (request.params.id) {
			const speaker = await Speaker.findByPk(request.params.id);
			if (speaker) {
				await speaker.destroy();
				response.status(204).send();
			} else {
				response.status(404).send();
			}
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function getSessions(request, response) {
	try {
		const sessions = await Session.findAll({
			where: request.query.roomId
				? {roomId: {[Sequelize.Op.eq]: request.query.roomId}}
				: undefined,
			attributes: ['id', 'title', 'roomId', 'speakerId']
		});
		if (sessions.length > 0) {
			response.status(200).json(sessions);
		} else {
			response.status(204).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function getSession(request, response) {
	try {
		if (request.params.id) {
			const session = await Session.findByPk(request.params.id);
			if (session) {
				response.json(session);
			} else {
				response.status(404).send();
			}
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function addSession(request, response) {
	try {
		if (request.body.title
			&& request.body.description
			&& request.body.begin
			&& request.body.end
			&& request.body.roomId
			&& request.body.speakerId) {
			await Session.create(request.body);
			response.status(201).send();
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function saveSession(request, response) {
	try {
		const session = await Session.findByPk(request.params.id);
		if (session) {
			Object.entries(request.body).forEach(([name, value]) => session[name] = value);
			await session.save();
			response.status(204).send();
		} else {
			response.status(404).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

async function removeSession(request, response) {
	try {
		if (request.params.id) {
			const session = await Session.findByPk(request.params.id);
			if (session) {
				await session.destroy();
				response.status(204).send();
			} else {
				response.status(404).send();
			}
		} else {
			response.status(400).send();
		}
	} catch (error) {
		response.status(500).json(error);
	}
}

export {
	getRooms, getRoom, addRoom, saveRoom, removeRoom,
	getSpeakers, getSpeaker, addSpeaker, saveSpeaker, removeSpeaker,
	getSessions, getSession, addSession, saveSession, removeSession
}