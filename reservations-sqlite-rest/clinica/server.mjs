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
	.use('/api', router)
	.use((error, request, response, next) => {
		// Tratat dupa router, altfel nu prinde erorile rutelor.
		const name = error.name || '';
		let status = error.status || error.statusCode;
		if (!status) {
			if (name === 'SequelizeValidationError'
				|| name === 'SequelizeDatabaseError') {
				status = 400;
			} else if (name === 'SequelizeForeignKeyConstraintError') {
				// Stergerea unei resurse referite => conflict; altfel cheie straina invalida.
				status = request.method === 'DELETE' ? 409 : 400;
			} else if (name === 'SequelizeUniqueConstraintError') {
				status = 409;
			} else {
				status = 500;
			}
		}
		if (status === 500) {
			console.error('There was an error.', error);
		}
		response.status(status).json({
			error: error.message,
			details: error.errors?.map(e => e.message)
		});
	});

try {
	await initialize();
	application.listen(PORT, () => console.log(`Server is listening on ${PORT}.`));
} catch (error) {
	console.error('There was an error.', error);
	process.exit(1);
}
