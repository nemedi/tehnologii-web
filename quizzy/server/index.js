const express = require('express');
const service = require('./service')('questions.json');
const PORT = 8080;
express()
  .use(express.static('../client'))
  .get('/next-question', (request, response) =>
    response.json(service.getNextQuestion())
  )
  .get('/another-question', (request, response) =>
    response.json(service.getAnotherQuestion())
  )  
  .get('/current-question', (request, response) => 
    response.json(service.getCurrentQuestion())
  )
  .get('/reset-current-question', (request, response) => 
    response.json(service.resetCurrentQuestion())
  )
  .listen(PORT, () => {
    console.log(`HTTP server is running on 'http://localhost:${PORT}'.`);
  });
