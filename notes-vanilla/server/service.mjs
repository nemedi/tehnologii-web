import {Note} from './repository.mjs';

async function getNotes(request, response) {
    try {
        const notes = await Note.findAll();
        if (notes.length > 0) {
            response.status(200).json(notes);
        } else {
            response.status(204).send();
        }
    } catch (error) {
        response.status(500).json(error);
    }
}

async function getNote(request, response) {
    try {
        const note = await Note.findByPk(request.params.id);
        if (note) {
            response.status(200).json(note);
        } else {
            response.status(404).send();
        }
    } catch (error) {
        response.status(500).json(error);
    }
}

async function addNote(request, response) {
    try {
        if (request.body.title && request.body.content) {
            const note = await Note.create(request.body);
            response.status(201)
                .location(`${request.protocol}://${request.hostname}:${request.socket.localPort}${request.baseUrl}${request.url}/${note.id}`)
                .send();
        } else {
            response.status(400).send();
        }
    } catch (error) {
        response.status(500).json(error);
    }
}

async function saveNote(request, response) {
    try {
        if (request.body.title && request.body.content) {
            const note = await Note.findByPk(request.params.id);
            if (note) {
                Object.entries(request.body).forEach(([key, value]) => note[key] = value);
                await note.save();
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

async function removeNote(request, response) {
    try {
        const note = await Note.findByPk(request.params.id);
        if (note) {
            await note.destroy();
            response.status(204).json(note);
        } else {
            response.status(404).send();
        }
    } catch (error) {
        response.status(500).json(error);
    }
}

export {
    getNotes, getNote, addNote, saveNote, removeNote
};
