const express = require('express');
const {join, resolve} = require('path');
const {getTasksByStatus, changeTaskStatus} = require('./service')('tasks.json');
const PORT = process.env.PORT || 8080;
express()
    .use(express.static(join(resolve('..'), 'client')))
    .get('/tasks', (request, response) => {
        const tasksByStatus = getTasksByStatus();
        if (Object.keys(tasksByStatus).length > 0) {
            response.json(tasksByStatus);
        } else {
            response.sendStatus(204);
        }
    })
    .put('/tasks', (request, response) => {
        if (request.query.task
            && request.query.oldStatus
            && request.query.newStatus) {
            if (changeTaskStatus(request.query.task,
                request.query.oldStatus,
                request.query.newStatus)) {
                response.sendStatus(204);
            } else {
                response.sendStatus(403);
            }
        } else {
            response.sendStatus(400);
        }
    })
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));