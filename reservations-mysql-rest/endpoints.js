const express = require('express');
const {join} = require('path');
const {existsSync, readFileSync} = require('fs');
const basicAuth = require('express-basic-auth');
const {Contact, Room, Meeting} = require('./repository');
const {
	handleSelectRecords,
	handleSelectRecord,
	handleCheckRecord,
	handleInsertRecord,
	handleUpdateRecord,
	handleDeleteRecord,
	handleSelectSubrecords,
	handleInsertSubrecord,
	handleDeleteSubrecord
} = require('./service');

const endpoints = (application, baseUrl) => {
	application.use(express.json());
	application.use(baseUrl, basicAuth({
		authorizer: (user, password) => {
			const file = join(__dirname, 'credentials.json');
			console.log(`Authenticate against ${file}.`);
			if (existsSync(file)) {
				const credentials = JSON.parse(readFileSync(file));
				return credentials[user] === password;
			} else {
				return false;
			}
		}
	}));
	application.use((error, request, response, next) => {
		if (error) {
			console.error('There was an error.', error);
			console.log(`Route returned internal server error.`);
			response.status(500).send(JSON.stringify(error));
		}
	});

  /**
   * @swagger
   * /contacts:
   *   get:
   *     description: Retrieves the list of contacts.
   *     tags: [Contacts]
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The list of contacts.
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *               createdAt:
   *                 type: string
   *                 format: date-time
   *               updatedAt:
   *                 type: string
   *                 format: date-time
   *             required:
   *               - id
   *               - firstName
   *               - lastName
   *               - email
   *       204:
   *         description: There are no contacts.
   *       401:
   *         description: Unauthorized access.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
	application.get(`${baseUrl}/contacts`, async (request, response) =>
		handleSelectRecords(Contact, request, response));

  /**
   * @swagger
   * /contacts/@id:
   *   get:
   *     description: Retrieves a contact by id.
   *     tags: [Contacts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Contact id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       200:
   *         description: The contact.
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             firstName:
   *               type: string
   *             lastName:
   *               type: string
   *             email:
   *               type: string
   *             createdAt:
   *               type: string
   *               format: date-time
   *             updatedAt:
   *               type: string
   *               format: date-time
   *             required:
   *               - id
   *               - firstName
   *               - lastName
   *               - email
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: There is no contact with the given id.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
	application.get(`${baseUrl}/contacts/:id`, async (request, response) =>
		handleSelectRecord(Contact, request, response));
	
  /**
   * @swagger
   * /contacts/@id:
   *   head:
   *     description: Checks if a contact with given id exists.
   *     tags: [Contacts]
   *     parameters:
   *       - name: id
   *         description: Contact id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       200:
   *         description: The contact with given id exists.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The contact with given id doesn't exist. 
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.head(`${baseUrl}/contacts/:id`, async (request, response) =>
		handleCheckRecord(Contact, request, response));		
	
  /**
   * @swagger
   * /contacts:
   *   post:
   *     description: Creates a new contact.
   *     tags: [Contacts]
   *     parameters:
   *       - name: contact
   *         description: Contact payload.
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             firstName:
   *               type: string
   *             lastName:
   *               type: string
   *             email:
   *               type: string
   *           required:
   *             - firstName
   *             - lastName
   *             - email
   *     responses:
   *       201:
   *         description: The contact has been created.
   *       401:
   *         description: Unauthorized access.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
	application.post(`${baseUrl}/contacts`, async (request, response) =>
		handleInsertRecord(Contact, request, response));

  /**
   * @swagger
   * /contacts/@id:
   *   put:
   *     description: Changes a contact with a given id.
   *     tags: [Contacts]
   *     parameters:
   *       - name: id
   *         description: Contact id.
   *         in: path
   *         required: true
   *         type: string
   *       - name: contact
   *         description: Contact payload.
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             firstName:
   *               type: string
   *             lastName:
   *               type: string
   *             email:
   *               type: string
   *           required:
   *             - firstName
   *             - lastName
   *             - email
   *     responses:
   *       204:
   *         description: The contact has been changed.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The contact doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.put(`${baseUrl}/contacts/:id`, async (request, response) =>
		handleUpdateRecord(Contact, request, response));

  /**
   * @swagger
   * /contacts/@id:
   *   delete:
   *     description: Removes a contact with a given id.
   *     tags: [Contacts]
   *     parameters:
   *       - name: id
   *         description: Contact id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       204:
   *         description: The contact has been removed.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The contact doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.delete(`${baseUrl}/contacts/:id`, async (request, response) =>
		handleDeleteRecord(Contact, request, response));

  /**
   * @swagger
   * /rooms:
   *   get:
   *     description: Retrieves the list of [available] rooms.
   *     tags: [Rooms]
   *     parameters:
   *       - name: begin
   *         description: Interval begin.
   *         in: query
   *         required: false
   *         type: string
   *         format: date-time
   *       - name: end
   *         description: Interval end.
   *         in: query
   *         required: false
   *         type: string
   *         format: date-time
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The list of rooms.
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *               name:
   *                 type: string
   *               capacity:
   *                 type: integer
   *               createdAt:
   *                 type: string
   *                 format: date-time
   *               updatedAt:
   *                 type: string
   *                 format: date-time
   *       204:
   *         description: There are no rooms.
   *       401:
   *         description: Unauthorized access.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
   application.get(`${baseUrl}/rooms`, async (request, response) =>
		handleSelectRecords(Room, request, response));

  /**
   * @swagger
   * /rooms/@id:
   *   get:
   *     description: Retrieves a room by id.
   *     tags: [Rooms]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Room id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       200:
   *         description: The room.
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             name:
   *               type: string
   *             capacity:
   *               type: integer
   *             createdAt:
   *               type: string
   *               format: date-time
   *             updatedAt:
   *               type: string
   *               format: date-time
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: There is no room with the given id.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
	application.get(`${baseUrl}/rooms/:id`, async (request, response) =>
		handleSelectRecord(Room, request, response));

  /**
   * @swagger
   * /rooms/@id:
   *   head:
   *     description: Checks if a room with given id exists.
   *     tags: [Rooms]
   *     parameters:
   *       - name: id
   *         description: Room id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       204:
   *         description: The room with given id exists.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The room with given id doesn't exist. 
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */			
	application.head(`${baseUrl}/rooms/:id`, async (request, response) =>
		handleCheckRecord(Room, request, response));			
	
  /**
   * @swagger
   * /rooms:
   *   post:
   *     description: Creates a new room.
   *     tags: [Rooms]
   *     parameters:
   *       - name: room
   *         description: Room payload.
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             capacity:
   *               type: integer
   *           required:
   *             - name
   *             - capacity
   *     responses:
   *       201:
   *         description: The room has been created.
   *       401:
   *         description: Unauthorized access.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
	application.post(`${baseUrl}/rooms`, async (request, response) =>
		handleInsertRecord(Room, request, response));

  /**
   * @swagger
   * /rooms/@id:
   *   put:
   *     description: Changes a room with a given id.
   *     tags: [Rooms]
   *     parameters:
   *       - name: id
   *         description: Room id.
   *         in: path
   *         required: true
   *         type: string
   *       - name: room
   *         description: Room payload.
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             capacity:
   *               type: integer
   *           required:
   *             - name
   *             - capacity
   *     responses:
   *       204:
   *         description: The contact has been changed.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The room doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.put(`${baseUrl}/rooms/:id`, async (request, response) =>
		handleUpdateRecord(Room, request, response));

  /**
   * @swagger
   * /rooms/@id:
   *   delete:
   *     description: Removes a room with a given id.
   *     tags: [Rooms]
   *     parameters:
   *       - name: id
   *         description: Room id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       204:
   *         description: The room has been removed.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The room doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.delete(`${baseUrl}/rooms/:id`, async (request, response) =>
		handleDeleteRecord(Room, request, response));

  /**
   * @swagger
   * /meetings:
   *   get:
   *     description: Retrieves the list of meetings.
   *     tags: [Meetings]
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The list of meetings.
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *               subject:
   *                 type: string
   *               description:
   *                 type: string
   *               roomId:
   *                 type: string
   *               organizerId:
   *                 type: string
   *               begin:
   *                 type: string
   *                 format: date-time
   *               end:
   *                 type: string
   *                 format: date-time
   *               createdAt:
   *                 type: string
   *                 format: date-time
   *               updatedAt:
   *                 type: string
   *                 format: date-time
   *             required:
   *               - id
   *               - subject
   *               - roomId
   *               - organizerId
   *               - begin
   *               - end
   *       204:
   *         description: There are no meetings.
   *       401:
   *         description: Unauthorized access.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.get(`${baseUrl}/meetings`, async (request, response) =>
		handleSelectRecords(Meeting, request, response));

  /**
   * @swagger
   * /meetings/@id:
   *   get:
   *     description: Retrieves a meeting by id.
   *     tags: [Meetings]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Meeting id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       200:
   *         description: The meeting.
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             subject:
   *               type: string
   *             description:
   *               type: string
   *             roomId:
   *               type: string
   *             organizerId:
   *               type: string
   *             begin:
   *               type: string
   *               format: date-time
   *             end:
   *               type: string
   *               format: date-time
   *             createdAt:
   *               type: string
   *               format: date-time
   *             updatedAt:
   *               type: string
   *               format: date-time
   *           required:
   *             - id
   *             - subject
   *             - roomId
   *             - organizerId
   *             - begin
   *             - end
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: There is no contact with the given id.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
   application.get(`${baseUrl}/meetings/:id`, async (request, response) =>
		handleSelectRecord(Meeting, request, response));

  /**
   * @swagger
   * /meetings/@id:
   *   head:
   *     description: Checks if a meeting with given id exists.
   *     tags: [Meetings]
   *     parameters:
   *       - name: id
   *         description: Meeting id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       204:
   *         description: The meeting with given id exists.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The meeting with given id doesn't exist. 
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */			
	application.head(`${baseUrl}/contacts/:id`, async (request, response) =>
		handleCheckRecord(Meeting, request, response));			

  /**
   * @swagger
   * /meetings:
   *   post:
   *     description: Creates a new meeting.
   *     tags: [Meetings]
   *     parameters:
   *       - name: meeting
   *         description: Meeting payload.
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             subject:
   *               type: string
   *             description:
   *               type: string
   *             roomId:
   *               type: string
   *             organizerId:
   *               type: string
   *             begin:
   *               type: string
   *               format: date-time
   *             end:
   *               type: string
   *               format: date-time
   *           required:
   *             - subject
   *             - roomId
   *             - organizerId
   *             - begin
   *             - end
   *     responses:
   *       201:
   *         description: The room has been created.
   *       401:
   *         description: Unauthorized access.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
	application.post(`${baseUrl}/meetings`, async (request, response) =>
		handleInsertRecord(Meeting, request, response));
	
  /**
   * @swagger
   * /meetings/@id:
   *   put:
   *     description: Changes a meeting with a given id.
   *     tags: [Meetings]
   *     parameters:
   *       - name: id
   *         description: Meeting id.
   *         in: path
   *         required: true
   *         type: string
   *       - name: meeting
   *         description: Meeting payload.
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             subject:
   *               type: string
   *             description:
   *               type: string
   *             roomId:
   *               type: string
   *             organizerId:
   *               type: string
   *             begin:
   *               type: string
   *               format: date-time
   *             end:
   *               type: string
   *               format: date-time
   *           required:
   *             - subject
   *             - roomId
   *             - organizerId
   *             - begin
   *             - end
   *     responses:
   *       204:
   *         description: The contact has been changed.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The meeting doesn't exist'.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.put(`${baseUrl}/meetings/:id`, async (request, response) =>
		handleUpdateRecord(Meeting, request, response));

  /**
   * @swagger
   * /meetings/@id:
   *   delete:
   *     description: Removes a meeting with a given id.
   *     tags: [Meetings]
   *     parameters:
   *       - name: id
   *         description: Meeting id.
   *         in: path
   *         required: true
   *         type: string 
   *     responses:
   *       204:
   *         description: The meeting has been removed.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The meeting doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.delete(`${baseUrl}/meetings/:id`, async (request, response) =>
		handleDeleteRecord(Meeting, request, response));

  /**
   * @swagger
   * /meetings/@id/attendees:
   *   get:
   *     description: Retrieves a meeting attendees.
   *     tags: [Meetings]
   *     parameters:
   *       - name: id
   *         description: Meeting id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: The list of meeting attendees.
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *       204:
   *         description: There are no meeting attendees.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The meeting doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */		
	application.get(`${baseUrl}/meetings/:id/attendees`, async (request, response) =>
		handleSelectSubrecords(Meeting, 'attendees', request, response));
 
  /**
   * @swagger
   * /meetings/@id/attendees:
   *   post:
   *     description: Adds a new meeting attendee.
   *     tags: [Meetings]
   *     parameters:
   *       - name: attendee
   *         description: Attendee id.
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: The attendee has been added.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The meeting doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */
	application.post(`${baseUrl}/meetings/:id/attendees`, async (request, response) =>
		handleInsertSubrecord(Meeting, 'attendees', request, response));			

  /**
   * @swagger
   * /meetings/@id/attendees/@subid:
   *   delete:
   *     description: Removes a meeting attendees with a given id.
   *     tags: [Meetings]
   *     parameters:
   *       - name: id
   *         description: Meeting id.
   *         in: path
   *         required: true
   *         type: string 
   *       - name: subid
   *         description: Attendee id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: The meeting atendee has been removed.
   *       401:
   *         description: Unauthorized access.
   *       404:
   *         description: The meeting or attendee doesn't exist.
   *       500:
   *         description: Something went wrong.
   *     security:
   *       - basicAuth:
   */	
	application.delete(`${baseUrl}/meetings/:id/attendees/:subid`, async (request, response) =>
		handleDeleteSubrecord(Meeting, 'attendees', request, response));			
};
module.exports = endpoints;