const express = require('express');
const names = require('./names');

const application = express();
application.get('/names/:name', async (request, response) => {
	response.send(await names(request.params.name));
});
const PORT = process.env.PORT || 8080;
application.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));