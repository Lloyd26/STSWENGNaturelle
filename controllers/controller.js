const User = require('../models/User');

const controller = {
    getIndex: function(req, res) {
        res.render('main', {
            layout: 'index',
            active: {home: true},
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getLogin: function(req, res) {
        if (!req.session.logged_in) {
            res.render('login', {layout: 'index', active: {login: true}});
        } else {
            res.redirect('/');
        }
    },

    postLogin: async function(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (email == undefined || password == undefined) {
            res.render('login', {layout: 'index', active: {login: true},
                error: 'Please enter your email and password.'});
            return;
        }

        let result = await User.findOne({email: email, password: password});

        if (result == null) {
            res.render('login', {layout: 'index', active: {login: true},
                error: 'Incorrect username or password!'});
            return;
        }

        req.session.logged_in = true;
        req.session.user = {
            firstName: result.firstName,
            lastName: result.lastName,
            contactNumber: result.contactNumber,
            email: result.email
        };

        res.redirect('/');
    },

    getRegister: function(req, res) {
        res.render('register', {layout: 'index', active: {login: true}});
    },

    getReservation: function(req, res) {
        res.render('reservation', {layout: 'index', active: {login: true}});
    },

    getReserveInfo: function(req, res) {
        res.render('reserveinfo', {layout: 'index', active: {login: true}});
    },

    getServices: function(req, res) {
        res.render('services', {layout: 'index', active: {login: true}});
    }
}

module.exports = controller;