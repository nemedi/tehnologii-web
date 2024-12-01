import express from 'express';
import {fetchFromRadar, fetchFlight} from 'flightradar24-client';
import airlines from 'airline-codes';
import puppeteer from 'puppeteer';

const PORT = process.env.PORT || 8080;
express()
    .use(express.static('../client'))
    .get('/coordinates/:city', async (request, response) => {
        const remoteResponse = await fetch(`https://nominatim.openstreetmap.org/search?city=${request.params.city}&format=json`);
        const body = await remoteResponse.json();
        if (body.length > 0) {
            response.json({
                latitude: parseFloat(body[0].lat),
                longitude: parseFloat(body[0].lon)
            });
        } else {
            response.sendStatus(404);
        }
    })
    .get('/flights', async (request, response) => {
        if (request.query.bounds) {
            const bounds = request.query.bounds.split(',')
                .map(value => parseFloat(value));
            const items = await fetchFromRadar(...bounds);
            const flights = [];
            if (items.length > 0) {
                const browser = await puppeteer.launch({headless: true});
                const page = await browser.newPage();
                for (let item of items) {
                    try {
                        const remoteResponse = await page.goto(
                            `https://data-live.flightradar24.com/clickhandler/?version=1.5&flight=${item.id}`,
                            {waitUntil: 'networkidle0'}
                        );
                        const body = await remoteResponse.json();
                        flights.push({
                            number: item.flight ? item.flight : 'Unknown',
                            airline: body.airline ? body.airline.name : 'Unknown',
                            aircraft: body.aircraft.model ? body.aircraft.model.text : 'Unknown',
                            from: body.airport.origin ? body.airport.origin.name : 'Unknown',
                            to: body.airport.destination ? body.airport.destination.name : 'Unknown'
                        });
                    } catch (error) {
                        console.error(error.message);
                    }
                }
                await browser.close();
                response.json(flights);
            } else {
                response.send(204);
            }
        } else {
            response.sendStatus(400);
        }
    })
    // .get('/flights', async (request, response) => {
    //     if (request.query.bounds) {
    //         const bounds = request.query.bounds.split(',')
    //             .map(value => parseFloat(value));
    //         const items = await fetchFromRadar(...bounds);
    //         const flights = [];
    //         if (items.length > 0) {
    //             for (let item of items) {
    //                 try {
    //                     const body = await fetchFlight(item.id);
    //                     const flight = {
    //                         number: item.flight ? item.flight : 'Unknown',
    //                         airline: body.airline ? body.airline.name : 'Unknown',
    //                         aircraft: body.model ? body.model : 'Unknown',
    //                         from: body.origin ? body.origin.name : 'Unknown',
    //                         to: body.destination ? body.destination.name : 'Unknown'
    //                     };
    //                     const airline = airlines.findWhere({iata:flight.airline});
    //                     if (airline) {
    //                         flight.airline = airline.get('name');
    //                     }
    //                     flights.push(flight);
    //                 } catch (error) {
    //                     console.error(error.message);
    //                 }
    //             }
    //             response.json(flights);
    //         } else {
    //             response.send(204);
    //         }
    //     } else {
    //         response.sendStatus(400);
    //     }
    // })
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));