const express = require('express');

const controller = require('../controllers/controller.js');
const auth_controller = require('../controllers/auth-controller');

const app = express();

app.get('/', controller.getIndex);

app.get('/about', controller.getAbout);

app.get('/login', auth_controller.getLogin);
app.post('/login', auth_controller.postLogin);

app.get('/admin', auth_controller.getAdminLogin);
app.post('/admin', auth_controller.postAdminLogin);

app.get('/logout', auth_controller.getLogout);
app.get('/logout/admin', auth_controller.getAdminLogout);

app.get('/register', auth_controller.getRegister);
app.post('/register', auth_controller.postRegister);

app.get('/reservation', controller.getReservation);

app.get('/services', controller.getServices);
app.get('/services/nails', controller.getNailServices);

app.get('/reserveinfo', controller.getReserveInfo);

module.exports = app;