const User = require('../models/User');
const Admin = require('../models/Admin');
const e = require("express");
const bcrypt = require('bcrypt');

const controller = {
    getLogin: function(req, res) {
        if (!req.session.logged_in || (req.session.logged_in && req.session.loginType != "customer")) {
            res.render('login', {layout: 'index', active: {login: true}});
        } else {
            res.redirect('/');
        }
    },

    postLogin: async function(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (email === undefined || password === undefined) {
            res.render('login', {
                layout: 'index',
                active: {login: true},
                error: 'Please enter your email and password.'
            });
            return;
        }

        let result = await User.findOne({email: email});

        if (result == null) {
            res.render('login', {
                layout: 'index',
                active: {login: true},
                error: 'Incorrect email address or password!'
            });
            return;
        }

        let passwordCompare = await bcrypt.compare(password, result.password);

        if (!passwordCompare) {
            res.render('login', {
                layout: 'index',
                active: {login: true},
                error: 'Incorrect email address or password!'
            });
            return;
        }

        req.session.logged_in = true;
        req.session.loginType = "customer";
        req.session.user = {
            firstName: result.firstName,
            lastName: result.lastName,
            contactNumber: result.contactNumber,
            email: result.email
        };

        if (req.query.next) res.redirect(decodeURIComponent(req.query.next));
        else res.redirect('/');
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

        const saltRounds = 10;

        let passwordHashed = await bcrypt.hash(password, saltRounds);

        let user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            password: passwordHashed
        }

        await User.create(user);

        req.session.logged_in = true;
        req.session.loginType = "customer";
        req.session.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            contactNumber: user.contactNumber,
            email: user.email
        };

        res.redirect('/');
    },

    getAdminLogin: function(req, res) {
        if (!req.session.logged_in || (req.session.logged_in && req.session.loginType != "admin")) {
            res.render('login-admin', {layout: 'admin-no-sidebar', active: {login: true}});
        } else {
            res.render('main-admin', {layout: 'admin', active: {login: true}});
        }
    },

    postAdminLogin: async function(req, res) {
        let username= req.body.username;
        let password = req.body.password;

        if (username === undefined || password === undefined) {
            res.render('login-admin', {
                layout: 'admin-no-sidebar',
                active: {login: true},
                error: 'Please enter your username and password.'
            });
            return;
        }

        let result = await Admin.findOne({username: username});

        if (result == null) {
            res.render('login-admin', {
                layout: 'admin-no-sidebar',
                active: {login: true},
                error: 'Incorrect username or password.'
            });
            return;
        }

        let passwordResult = await Admin.findOne({password: password});
        //let passwordCompare = await bcrypt.compare(password, result.password);

        if (passwordResult == null) {
            res.render('login-admin', {
                layout: 'admin-no-sidebar',
                active: {login: true},
                error: 'Incorrect username or password.'
            });
            return;
        }

        req.session.logged_in = true;
        req.session.loginType = "admin";
        req.session.user = {
            username: result.username
        };

        res.render('main-admin', {
            layout: 'admin',
            loginType: req.session.loginType,
            active: {login: true},
        });
    },
    
    getAdminLogout: function(req, res) {
        req.session.destroy(err => {
            if (err) throw err;

            res.redirect('/admin');
        })
    },
}

module.exports = controller;