import {config} from 'dotenv';
import express, {urlencoded, json} from 'express';
import router from './router.mjs';
import {initialize} from './repository.mjs';
config();
const PORT = process.env.PORT || 8080;
express()
    .use(express.static('../client/build'))
    .use(urlencoded({extended: true}))
    .use(json())
    .use('/api', router)
    .listen(PORT, async () => {
        try {
            await initialize();
            console.log(`Server is running on port ${PORT}.`)
        } catch (error) {
            console.error(error);
        }
    });