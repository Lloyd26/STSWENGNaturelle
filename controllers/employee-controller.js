const Employee = require('../models/Employee')
const ServiceCollection = require('../models/ServiceCollection.js');
const Service = require('../models/Service.js');
const SpecialService = require('../models/SpecialService.js');
const Reservation = require('../models/Reservation.js');
const InCartService = require('../models/InCartService.js');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');


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
                employee_id: result._id,
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

        res.render('employee-reservations', {
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
    },

    getEmployeeReservations: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "employee") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let reservations = await Reservation.find({}).populate('services').populate('userID', 'firstName lastName').exec();
        let employee_id = new ObjectId (req.query.id)
        const filteredReservations = reservations.filter(reservation => {
            let foundMatch = false;
            reservation.services.forEach(service => {
                console.log(service)
                if (service.employeeID == undefined){
                    foundMatch = false;
                } else if (service.employeeID.equals(employee_id)) {
                    foundMatch = true;
                }
            });
            console.log(foundMatch)
            return foundMatch;
        });
        console.log(filteredReservations)
        res.send(filteredReservations)
    }
}

module.exports = controller;