const Admin = require('../models/Admin');

const controller = {
    getAdminLogin: function(req, res) {
        if (!req.session.logged_in) {
            res.render('login-admin', {layout: 'admin-no-sidebar'});
        } else if (req.session.loginType !== "admin") {
            res.render('login-admin', {
                layout: 'admin-no-sidebar',
                snackbar: {
                    type: "error",
                    text: "You need to logout as a customer before you can login as an admin.",
                    action: {
                        text: "LOGOUT",
                        link: "/logout"
                    }
                }
            });
        } else {
            res.render('main-admin', {layout: 'admin'});
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

        res.render('main-admin', {
            layout: 'admin',
            loginType: req.session.loginType,
            active: {login: true},
        });
    },
}

module.exports = controller;