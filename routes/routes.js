const express = require('express');

const controller = require('../controllers/controller.js');

const app = express();

app.get('/', controller.getIndex);

app.get('/login', controller.getLogin);

module.exports = app;