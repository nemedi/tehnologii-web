import { config } from 'dotenv';
import express, { json } from 'express';
import { initialize } from './repository.mjs';
import router from './router.mjs';
config();
const PORT = process.env.PORT || 8080;
express()
	.use(json())
	.use(express.static('../client'))
	.use('/models', router)
	.listen(PORT, async () => {
		try {
			await initialize();
		} catch (error) {
			console.error(error);
		}
	});