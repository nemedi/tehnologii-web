const { config } = require('dotenv');
const express = require('express');
const {initialize} = require('./repository');
const endpoints = require('./endpoints');
const swagger = require('./swagger');
config();
initialize()
.then(() => {
	const application = express();
	const baseUrl = '/api/v1';
	endpoints(application, baseUrl);
	swagger(application, baseUrl);
	const PORT = process.env.PORT || 8080;
	application.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
});
