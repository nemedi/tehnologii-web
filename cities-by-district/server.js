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
    .listen(PORT, () => console.log(`Server is listening on ${PORT}.`));