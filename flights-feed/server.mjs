import express from 'express';
import {fetchFromRadar, fetchFlight} from 'flightradar24-client';
const PORT = process.env.PORT || 8080;
express()
    .get('/flights', async (request, response) => 
        response.json(await fetchFromRadar(
            ...request.query.bounds.split(',')
                .map(value => parseFloat(value))
        ))
    )
    .get('/flights/:id', async (request, response) =>
        response.json(await fetchFlight(request.params.id))
    )
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));