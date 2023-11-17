const Admin = require('../models/Admin');

const controller = {
    getAdminLogin: function(req, res, next) {
        if (!req.session.logged_in) {
            res.render('login-admin', {layout: 'admin-no-sidebar'});
        } else if (req.session.logged_in.type !== "admin") {
            res.render('login-admin', {
                layout: 'admin-no-sidebar',
                logged_in: req.session.logged_in,
                snackbar: {
                    type: "error",
                    text: "You need to logout as a customer before you can login as an admin.",
                    action: {
                        text: "LOGOUT",
                        link: "/logout?next=%2Fadmin"
                    }
                }
            });
        } else {
            next();
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

        req.session.logged_in = {
            state: true,
            type: "admin",
            user: {
                username: result.username
            }
        };

        res.redirect('/admin');
    },

    getAdminDashboard: function(req, res, next) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            next();
            return;
        }

        res.render('main-admin', {
            layout: 'admin',
            logged_in: req.session.logged_in,
            active: {admin_home: true}
        });
    }
}

module.exports = controller;