import express, { json } from 'express';
import { join, resolve } from 'path';
import { initialize } from './repository.mjs';
import router from './router.mjs';
const PORT = process.env.port || 8080;
express()
	.use(json())
	.use(express.static(join(resolve(), 'public')))
	.use('/models', router)
	.listen(PORT, async () => {
		try {
			await initialize();
		} catch (error) {
			console.error(error);
		}
	});