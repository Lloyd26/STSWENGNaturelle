const express = require('express');

const controller = require('../controllers/controller.js');

const app = express();

app.get('/', controller.getIndex);

app.get('/login', controller.getLogin);
app.post('/login', controller.postLogin);

app.get('/register', controller.getRegister);

app.get('/reservation', controller.getReservation);

app.get('/services', controller.getServices);

app.get('/reserveinfo', controller.getReserveInfo);

module.exports = app;