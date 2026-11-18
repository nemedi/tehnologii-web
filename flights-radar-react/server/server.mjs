import express from 'express';
import {getCoordinates, getFlights} from './service.mjs';

const PORT = process.env.PORT || 8080;
express()
    .use(express.static('../client/dist'))
    .get('/coordinates/:city', async (request, response) => {
        const coordinates = await getCoordinates(request.params.city);
        if (coordinates) {
            response.json(coordinates);
        } else {
            response.sendStatus(404);
        }
    })
    .get('/flights', async (request, response) => {
        if (request.query.latitude !== undefined
            && request.query.longitude !== undefined) {
            const flights = await getFlights(parseFloat(request.query.latitude),
                parseFloat(request.query.longitude));
            if (flights.length > 0) {
                response.json(flights);
            } else {
                response.sendStatus(204);
            }
        } else {
            response.sendStatus(400);
        }
    })
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));