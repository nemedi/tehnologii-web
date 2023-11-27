import express from 'express';
import { getNotes, getNote, addNote, saveNote, removeNote } from './service.mjs';
const router = express.Router();
router.route('/notes')
    .get((request, response) => getNotes(request, response))
    .post((request, response) => addNote(request, response));
router.route('/notes/:id')
    .get((request, response) => getNote(request, response))
    .put((request, response) => saveNote(request, response))
    .delete((request, response) => removeNote(request, response));
export default router;
