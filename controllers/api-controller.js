const Employee = require('../models/Employee');
const Service = require('../models/Service');
const SpecialService = require('../models/SpecialService');

const controller = {
    getEmployees: async function(req, res) {
        if (!req.session.logged_in || !req.session.logged_in.state) {
            res.status(401); // HTTP 401: Unauthorized
            return;
        }

        let employees = await Employee.find({}, '_id firstName lastName');
        res.send(employees);
    },

    getServices: async function(req, res) {
        if (!req.session.logged_in || !req.session.logged_in.state) {
            res.status(401); // HTTP 401: Unauthorized
            return;
        }

        let services = await Service.find({}, '');
        let specialServices = await SpecialService.find({}, '');

        res.send({
            services: services,
            specialServices: specialServices
        });
    }
}

module.exports = controller;