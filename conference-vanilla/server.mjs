import express, { json } from 'express';
import { join, resolve } from 'path';
import { initialize } from './repository.mjs';
import router from './router.mjs';

express()
	.use(json())
	.use(express.static(join(resolve(), 'public')))
	.use('/models', router)
	.listen(9090, async () => {
		try {
			await initialize();
		} catch (error) {
			console.error(error);
		}
	});