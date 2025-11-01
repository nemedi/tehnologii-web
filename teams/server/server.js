const express = require('express');
const {getTeams, getTeamMembers, addTeam, addTeamMember, removeTeamMember, removeTeam}
    = require('./service')('teams.json');
const PORT = 8080;
express()
    .use(express.static('../client'))
    .use(express.text())
    .get('/teams', (request, response) => {
        const teams = getTeams();
        if (teams.length > 0) {
            response.json(teams);
        } else {
            response.sendStatus(204);
        }
    })
    .get('/teams/:team/members', (request, response) => {
        const members = getTeamMembers(request.params.team);
        if (members) {
            response.json(members);
        } else {
            response.sendStatus(404);
        }
    })
    .post('/teams', (request, response) => {
        if (addTeam(request.body)) {
            return response.sendStatus(201);
        } else {
            response.sendStatus(403);
        }
    })
    .post('/teams/:team/members', (request, response) => {
        if (addTeamMember(request.params.team, request.body)) {
            return response.sendStatus(201);
        } else {
            response.sendStatus(403);
        }
    })
    .delete('/teams/:team/members/:member', (request, response) => {
        if (removeTeamMember(request.params.team, request.params.member)) {
            return response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .delete('/teams/:team', (request, response) => {
        if (removeTeam(request.params.team)) {
            return response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .listen(PORT, () => console.log(`Server is running on ${PORT}.`));