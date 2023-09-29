const {join, resolve} = require('path');
const express = require('express');
const {getDistricts, getCitiesByDistrict} = require('./service');
const PORT = process.env.PORT || 8080;
express()
    .use(express.static(join(resolve(), 'web')))
    .get('/districts', (request, response) =>
        response.json(getDistricts()))
    .get('/cities', (request, response) =>
        response.json(getCitiesByDistrict(request.query.district)))
    .listen(8080, () => console.log(`Sever is listening on ${PORT}.`));