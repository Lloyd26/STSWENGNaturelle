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

    getAbout: function(req, res) {
        res.render('about', {
            layout: 'index',
            active: {about: true},
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getReservation: function(req, res) {
        if (!req.session.logged_in) {
            res.redirect("/login?next=" + encodeURIComponent("/reservation"));
            return;
        }

        res.render('reservation', {
            layout: 'index',
            active: {reservation: true},
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getReserveInfo: function(req, res) {
        res.render('reserveinfo', {
            layout: 'index',
            active: {reservation: true},
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getServices: function(req, res) {
        res.render('services', {
            layout: 'index',
            active: {services: true},
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getAdminLogin: function(req, res) {
        res.render('login-admin', {
            layout: 'admin',
            active: {services: true},
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getAdminIndex: function(req, res) {
        res.render('main-admin', {
            layout: 'admin',
            active: {services: true},
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    }
}

module.exports = controller;