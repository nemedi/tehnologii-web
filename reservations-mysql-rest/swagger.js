const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
module.exports = (application, baseUrl) => {
	const options = {
		swagger: '2.0',
		swaggerDefinition: {
			info: {
			  title: 'Reservations API',
			  version: '1.0.0',
			  description: '',
			},
			basePath: baseUrl
		},
		securityDefinitions: {
			BasicAuth: {
				type: 'basic'
			}
		},
		apis: ['endpoints.js']
	};
	application.use('/api-docs',
		swaggerUI.serve,
		swaggerUI.setup(swaggerJsdoc(options)));
};