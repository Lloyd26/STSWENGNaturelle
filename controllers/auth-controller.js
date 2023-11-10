const User = require('../models/User');
const e = require("express");

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
    },

    postRegister: async function(req, res) {
        let firstName = req.body.first_name;
        let lastName = req.body.last_name;
        let email = req.body.email;
        let contactNumber = req.body.contact_number;
        let password = req.body.password;

        // Check if 'email' is empty
        if (email === '') {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Please enter your email address!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if email is already in use by someone else
        let emailCheck = await User.findOne({email: email}, 'email');
        if (emailCheck != null && emailCheck.email === email) {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Email address is already in use!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if 'firstName' is empty
        if (firstName === '') {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Please enter your first name!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if 'lastName' is empty
        if (lastName === '') {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Please enter your last name!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if 'contactNumber' is empty
        if (contactNumber === '') {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Please enter your contact number!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if 'password' is empty
        if (password === '') {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Please enter your password!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if 'email' is valid
        const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!validEmailRegex.test(email)) {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Please enter a valid email address!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if 'contactNumber' is valid
        const validContactNumRegex = /^(09)\d{9}/;
        if (!validContactNumRegex.test(contactNumber)) {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Please follow the contact number format: 09XXXXXXXXX',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        // Check if 'password' contains at least 8 characters
        if (password.length < 8) {
            res.render('register', {
                layout: 'index',
                active: {login: true},
                error: 'Password must contain at least 8 characters!',
                form: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactNumber: contactNumber
                }
            });
            return;
        }

        let user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            password: password
        }

        await User.create(user);

        req.session.logged_in = true;
        req.session.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            contactNumber: user.contactNumber,
            email: user.email
        };

        res.redirect('/');
    }
}

module.exports = controller;