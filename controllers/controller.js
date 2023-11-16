const ServiceCollection = require('../models/ServiceCollection.js');
const Service = require('../models/Service.js');

const controller = {
    getLogout: function(req, res) {
        let redirect;

        if (req.session.logged_in.type === "customer") redirect = '/';
        else if (req.session.logged_in.type === "admin") redirect = '/admin';

        req.session.destroy(err => {
            if (err) throw err;

            res.redirect(redirect);
        });
    },

    getIndex: function(req, res) {
        res.render('main', {
            layout: 'index',
            active: {home: true},
            logged_in: req.session.logged_in
        });
    },

    getAbout: function(req, res) {
        res.render('about', {
            layout: 'index',
            active: {about: true},
            logged_in: req.session.logged_in
        });
    },

    getReservation: function(req, res) {
        if (!req.session.logged_in || (req.session.logged_in && req.session.logged_in.type !== "customer")) {
            res.redirect("/login?next=" + encodeURIComponent("/reservation"));
            return;
        }

        res.render('reservation', {
            layout: 'index',
            active: {reservation: true},
            logged_in: req.session.logged_in
        });
    },

    getReserveInfo: function(req, res) {
        res.render('reserveinfo', {
            layout: 'index',
            active: {reservation: true},
            logged_in: req.session.logged_in
        });
    },

    getServices: function(req, res) {
        res.render('services', {
            layout: 'index',
            active: {services: true},
            logged_in: req.session.logged_in
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
            logged_in: req.session.logged_in,
            serviceCollections: nailServiceCollections
        });
    }
}

module.exports = controller;