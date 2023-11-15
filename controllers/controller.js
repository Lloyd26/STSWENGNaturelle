const ServiceCollection = require('../models/ServiceCollection.js');
const Service = require('../models/Service.js');

const controller = {
    getIndex: function(req, res) {
        res.render('main', {
            layout: 'index',
            active: {home: true},
            loginType: req.session.loginType,
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
            loginType: req.session.loginType,
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getReservation: function(req, res) {
        if (!req.session.logged_in || (req.session.logged_in && req.session.loginType != "customer")) {
            res.redirect("/login?next=" + encodeURIComponent("/reservation"));
            return;
        }

        res.render('reservation', {
            layout: 'index',
            active: {reservation: true},
            loginType: req.session.loginType,
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
            loginType: req.session.loginType,
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
            loginType: req.session.loginType,
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            }
        });
    },

    getNailServices: async function(req, res) {
        let nailServiceCollections = await ServiceCollection.find({
            serviceConcern: "Nails"
        })
        .populate('serviceConcern')
        .populate('serviceTitle')
        .lean().exec();

        console.log(nailServiceCollections)

        res.render('services', {
            layout: 'index',
            active: {services: true},
            loginType: req.session.loginType,
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            },
            serviceCollections: nailServiceCollections
        });
    }
}

module.exports = controller;