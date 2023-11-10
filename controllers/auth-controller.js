const User = require('../models/User');

const controller = {
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

        if (email === undefined || password === undefined) {
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

    getLogout: function(req, res) {
        req.session.destroy(err => {
            if (err) throw err;

            res.redirect('/');
        })
    },

    getRegister: function(req, res) {
        res.render('register', {layout: 'index', active: {login: true}});
    }
}

module.exports = controller;