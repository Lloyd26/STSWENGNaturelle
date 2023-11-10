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

    getReservation: function(req, res) {
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
    }
}

module.exports = controller;