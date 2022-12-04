import express from 'express';
import { Room, Contact, Meeting } from './repository.mjs';
import {
	getRecords,
	getRecord,
	headRecord,
	postRecord,
	putRecord,
	patchRecord,
	deleteRecords,
	deleteRecord
} from './service.mjs';

 /**
 * @openapi
 * /api/rooms:
 *   get:
 *     summary: Get the list of records.
 *     description: Retrieve the list of records.
 *     tags: [Rooms]
 *     parameters:
 *       - in: header
 *         name: x-fields
 *         required: false
 *         description: The list of fields to retrieve for each record.
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-sort
 *         required: false
 *         description: Sorting criteria including direction.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               item:
 *                 $ref: '#/components/schemas/Room'
 *       204:
 *         description: No records found.
 *       401:
 *         description: Unauthorized access. 
 *       403:
 *         description: Forbidden access.
 *       500:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 * /api/contacts:
 *   get:
 *     summary: Get the list of records.
 *     description: Retrieve the list of records.
 *     tags: [Contacts]
 *     parameters:
 *       - in: header
 *         name: x-fields
 *         required: false
 *         description: The list of fields to retrieve for each record.
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-sort
 *         required: false
 *         description: Sorting criteria including direction.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               item:
 *                 $ref: '#/components/schemas/Contact'
 *       204:
 *         description: No records found.
 *       401:
 *         description: Unauthorized access. 
 *       403:
 *         description: Forbidden access.
 *       500:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 * /api/meetings:
 *   get:
 *     summary: Get the list of records.
 *     description: Retrieve the list of records.
 *     tags: [Meetings]
 *     parameters:
 *       - in: header
 *         name: x-fields
 *         required: false
 *         description: The list of fields to retrieve for each record.
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-sort
 *         required: false
 *         description: Sorting criteria including direction.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               item:
 *                 $ref: '#/components/schemas/Meeting'
 *       204:
 *         description: No records found.
 *       401:
 *         description: Unauthorized access. 
 *       403:
 *         description: Forbidden access.
 *       500:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 * components:
 *   schemas:
 */

const router = express.Router();

router.route('/rooms')
 	.get(async (request, response) => getRecords(Room, request, response))
	.post(async (request, response) => postRecord(Room, request, response))
	.delete(async (request, response) => deleteRecords(Room, request, response))

router.route('/rooms/:id')
	.get(async (request, response) => getRecord(Room, request, response))
	.head(async (request, response) => headRecord(Room, request, response))
	.put(async (request, response) => putRecord(Room, request, response))
	.patch(async (request, response) => patchRecord(Room, request, response))
	.delete(async (request, response) => deleteRecord(Room, request, response));

router.route('/contacts')
	.get(async (request, response) => getRecords(Contact, request, response))
	.post(async (request, response) => postRecord(Contact, request, response))
	.delete(async (request, response) => deleteRecords(Contact, request, response));

router.route('/contacts/:id')
	.get(async (request, response) => getRecord(Contact, request, response))
	.head(async (request, response) => headRecord(Contact, request, response))
	.put(async (request, response) => putRecord(Contact, request, response))
	.patch(async (request, response) => patchRecord(Contact, request, response))
	.delete(async (request, response) => deleteRecord(Contact, request, response));

router.route('/meetings')
	.get(async (request, response) => getRecords(Meeting, request, response))
	.post(async (request, response) => postRecord(Meeting, request, response))
	.delete(async (request, response) => deleteRecords(Meeting, request, response));

router.route('/meetings/:id')
	.get(async (request, response) => getRecord(Meeting, request, response))
	.head(async (request, response) => headRecord(Meeting, request, response))
	.put(async (request, response) => putRecord(Meeting, request, response))
	.delete(async (request, response) => deleteRecord(Meeting, request, response));

export default router;