import express, { json } from 'express';
import {join, resolve} from 'path';
import {existsSync, readFileSync} from 'fs';
import basicAuth from 'express-basic-auth';
import swaggerJsdoc from 'swagger-jsdoc';
import {serve, setup} from 'swagger-ui-express';
import {initialize} from './repository.mjs';
import routes from './routes.mjs';

const PORT = process.env.PORT || 8080;
const application = express();
application
	.use(json())
	.use('/api', basicAuth({
		authorizer: (user, password) => {
			const file = join(resolve(), 'credentials.json');
			console.log(`Authenticate against ${file}.`);
			if (existsSync(file)) {
				const credentials = JSON.parse(readFileSync(file));
				return credentials[user] === password;
			} else {
				return false;
			}
		}
	}))
	.use((error, request, response, next) => {
		if (error) {
			console.error('There was an error.', error);
			response.status(500).send(JSON.stringify(error));
		}
	})
	.use('/api', routes)
	.use('/api-docs', serve,
		setup(swaggerJsdoc({
			openapi: '3.0.0',
			swaggerDefinition: {
				info: {
					title: 'Reservations API',
					version: '1.0.0',
					description: '',
				}
			},
			servers: {
				url: '/api'
			},
			securityDefinitions: {
				BasicAuth: {
					type: 'basic'
				}
			},			
			apis: ['./routes.mjs']
		})))
	.listen(PORT, async () => {
		try {
			await initialize();
			console.log(`Server is listening on ${PORT}.`);
		} catch (error) {
			console.error(`${error}`);
		}
	});