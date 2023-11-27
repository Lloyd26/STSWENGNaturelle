const Employee = require('../models/Employee');

const controller = {
    getEmployees: async function (req, res) {
        if (!req.session.logged_in || !req.session.logged_in.state) {
            res.status(401); // HTTP 401: Unauthorized
            return;
        }

        let employees = await Employee.find({}, '_id firstName lastName');
        res.send(employees);
    }
}

module.exports = controller;