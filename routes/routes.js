const express = require('express');

const controller = require('../controllers/controller.js');
const auth_controller = require('../controllers/auth-controller');
const admin_controller = require('../controllers/admin-controller');

const app = express();

app.get('/', controller.getIndex);

app.get('/about', controller.getAbout);

app.get('/login', auth_controller.getLogin);
app.post('/login', auth_controller.postLogin);

app.get('/logout', controller.getLogout);

app.get('/register', auth_controller.getRegister);
app.post('/register', auth_controller.postRegister);

app.get('/reservation', controller.getReservation);

app.get('/services', controller.getServices);
app.get('/services/nails', controller.getNailServices);

app.get('/reserveinfo', controller.getReserveInfo);

app.get('/admin', admin_controller.getAdminLogin, admin_controller.getAdminDashboard);
app.post('/admin', admin_controller.postAdminLogin);

app.get('/admin/employees', admin_controller.getAdminEmployees);
app.get('/admin/employees/get', admin_controller.getAllEmployees);
app.post('/admin/employees/add', admin_controller.postAddEmployee);
app.post('/admin/employees/edit', admin_controller.postEditEmployee);
app.post('/admin/employees/delete', admin_controller.postDeleteEmployee);

app.get('/admin/services', admin_controller.getAdminServices);
app.post('/admin/services/add-service-collection', admin_controller.postAddServiceCollection);
app.delete('/admin/services/delete-service-collection', admin_controller.deleteServiceCollection);

module.exports = app;