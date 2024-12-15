import express, { json } from 'express';
import cors from 'cors';
import { initialize } from './repository.mjs';
import router from './router.mjs';
const PORT = process.env.PORT || 8080;
express()
	.use(cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		optionsSuccessStatus: 200
	}))
	.use(json())
	.use(express.static('../client/build'))
	.use('/models', router)
	.listen(PORT, async () => {
		try {
			await initialize();
			console.log(`Server is running on port ${PORT}`);
		} catch (error) {
			console.error(error);
		}
	});