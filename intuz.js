const app = require('express')();
const fs = require('fs');
const path = require('path');
const body_parser = require('body-parser');

app.use(body_parser.json());


let setupRoutes = require('./controllers/index.js');
setupRoutes(app);






module.exports =  app;
