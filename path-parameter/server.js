const express = require('express');
const {join, resolve} = require('path');
const {existsSync, statSync, readFileSync} = require('fs');
const port = process.env.port || 8080;
express()
    .get('/:path(*)', async (request, response) => {
        let path = join(resolve('files', request.params.path));
        if (existsSync(path)) {
            let stat = statSync(path);
            if (stat.isFile()) {
                response.send(readFileSync(path));
            } else if (stat.isDirectory()) {
                response.sendStatus(403);
            }
        } else {
            response.sendStatus(404);
        }
    })
    .listen(port, () => console.log(`Server is running on port ${port}.`));