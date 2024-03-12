const Employee = require('../models/Employee')
const ServiceCollection = require('../models/ServiceCollection.js');
const Service = require('../models/Service.js');
const SpecialService = require('../models/SpecialService.js');
const Reservation = require('../models/Reservation.js');
const InCartService = require('../models/InCartService.js');
const bcrypt = require('bcrypt');


const controller = {
    getEmployeeLogin: function(req, res, next) {
        if (!req.session.logged_in) {
            res.render('login-employee', {layout: 'employee-no-sidebar'});
        } else if (req.session.logged_in.type !== "employee") {
            res.render('login-employee', {
                layout: 'employee-no-sidebar',
                logged_in: req.session.logged_in,
                snackbar: {
                    type: "error",
                    persistent: true,
                    text: "You need to logout as a customer before you can login as an employee.",
                    action: {
                        text: "LOGOUT",
                        link: "/logout?next=%2Femployee"
                    }
                }
            });
        } else {
            next();
        }
    },

    postEmployeeLogin: async function(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (email === undefined || password === undefined) {
            res.render('login-employee', {
                layout: 'employee-no-sidebar',
                active: {login: true},
                error: 'Please enter your email and password.'
            });
            return;
        }

        let result = await Employee.findOne({email: email});

        if (result == null) {
            res.render('login-employee', {
                layout: 'employee-no-sidebar',
                active: {login: true},
                error: 'Incorrect email or password.'
            });
            return;
        }

        if (result.changedPassword){
            let passwordCompare = await bcrypt.compare(password, result.password);
            if (!passwordCompare) {
                res.render('login-employee', {
                    layout: 'employee-no-sidebar',
                    active: {login: true},
                    error: 'Incorrect email or password.'
                });
                return;
            }
        } else {
            if (result.password != password) {
                res.render('login-employee', {
                    layout: 'employee-no-sidebar',
                    active: {login: true},
                    error: 'Incorrect email or password.'
                });
                return;
            }
        }

        let employee_name = result.firstName + " "+ result.lastName

        req.session.logged_in = {
            state: true,
            type: "employee",
            user: {
                employee_name: employee_name,
                employee_firstName: result.firstName,
                employee_lastName: result.lastName,
                employee_email: result.email,
                employee_contactNumber: result.contactNumber,
                employee_password: result.password,
                employee_changedPassword: result.changedPassword
            }
        };

        if (req.query.next) res.redirect(decodeURIComponent(req.query.next));
        else res.redirect('/employee');
    },

    getEmployeeDashboard: function(req, res, next) {
        if (!req.session.logged_in || req.session.logged_in.type !== "employee") {
            next();
            return;
        }

        res.render('main-employee', {
            layout: 'employee',
            logged_in: req.session.logged_in,
            active: {employee_home: true}
        });
    },

    getRequestTempPassword: async function(req, res, next) {
        let employee = await Employee.findOne({_id:req.query.id})

        let password = {
            password: employee.password
        }

        res.send(password)
    }
}

module.exports = controller;