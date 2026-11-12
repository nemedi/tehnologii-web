import { config } from 'dotenv';
import express, { json } from 'express';
import { initialize } from './repository.mjs';
import security from './security.mjs';
import router from './router.mjs';

config();
const PORT = process.env.PORT || 8080;
const application = express();

application
	.use(json())
	.use('/api', security)
	.use((error, request, response, next) => {
		if (error) {
			console.error('There was an error.', error);
			response.status(500).json(error);
		}
	})
	.use('/api', router)
	.listen(PORT, async () => {
		try {
			await initialize();
			console.log(`Server is listening on ${PORT}.`);
		} catch (error) {
			console.error('There was an error.', error);
		}
	});