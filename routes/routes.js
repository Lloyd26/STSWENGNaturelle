const express = require('express');

const controller = require('../controllers/controller.js');
const auth_controller = require('../controllers/auth-controller');

const app = express();

app.get('/', controller.getIndex);

app.get('/login', auth_controller.getLogin);
app.post('/login', auth_controller.postLogin);

app.get('/register', auth_controller.getRegister);

app.get('/reservation', controller.getReservation);

app.get('/services', controller.getServices);

app.get('/reserveinfo', controller.getReserveInfo);

module.exports = app;