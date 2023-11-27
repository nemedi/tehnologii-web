import {config} from 'dotenv';
import express, {urlencoded, json} from 'express';
import {resolve, join} from 'path';
import router from './router.mjs';
import {initialize} from './repository.mjs';
config();
const PORT = process.env.PORT || 8080;
express()
    .use(express.static(join(resolve('..'), 'client')))
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