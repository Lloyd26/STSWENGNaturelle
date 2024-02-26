const ServiceCollection = require('../models/ServiceCollection.js');
const Service = require('../models/Service.js');
const SpecialService = require('../models/SpecialService.js');
const FAQ = require('../models/FAQ.js');
const Reservation = require('../models/Reservation.js');
const Notification = require('../models/Notification');

const controller = {
    getLogout: function (req, res) {
        let redirect;

        switch (req.session.logged_in.type) {
            case "customer":
                redirect = '/';
                break;
            case "admin":
                redirect = '/admin';
                break;
        }

        req.session.destroy(err => {
            if (err) throw err;

            if (req.query.next) res.redirect(decodeURIComponent(req.query.next));
            else res.redirect(redirect);
        });
    },

    getIndex: function (req, res) {
        res.render('main', {
            layout: 'index',
            active: { home: true },
            logged_in: req.session.logged_in
        });
    },

    getAbout: function (req, res) {
        res.render('about', {
            layout: 'index',
            active: { about: true },
            logged_in: req.session.logged_in
        });
    },

    getReservation: function (req, res) {
        if (!req.session.logged_in || (req.session.logged_in && req.session.logged_in.type !== "customer")) {
            res.redirect("/login?next=" + encodeURIComponent("/reservation"));
            return;
        }

        res.render('reservation', {
            layout: 'index',
            active: { reservation: true },
            logged_in: req.session.logged_in
        });
    },

    getReserveInfo: async function (req, res) {

        if (!req.session.logged_in || (req.session.logged_in && req.session.logged_in.type !== "customer")) {
            res.redirect("/login?next=" + encodeURIComponent("/reservation"));
            return;
        }

        let userID = req.session.logged_in.user.userID;

        let reservation_info = await Reservation.find({ currentUserID: userID }).populate('services').lean().exec();

        let reservationsWithFormattedDate = reservation_info.map(coll => {
            
            formattedDate = new Date(coll.timestamp).toUTCString();

            return {
                currentUserID: coll.currentUserID,
                timestamp: formattedDate,
                services: coll.services,
                status: coll.status,
            }
        });

        res.render('reserveinfo', {
            layout: 'index',
            active: { reservation: true },
            logged_in: req.session.logged_in,
            reservation_info: reservationsWithFormattedDate

        });
    },

    getServices: async function (req, res) {

        // Find all Nail related services
        let serviceCollections = await ServiceCollection.find({
            serviceConcern: req.params.serviceconcern
        }).populate('services').populate('specialServices')

        let pricesCollectionObject = [];
        let pricesWithOption2 = [];

        // Transform to JSON object
        let serviceCollectionsObject = serviceCollections.map(coll => coll.toObject());

        // Check each service option combination
        let mappedServiceCollection = serviceCollectionsObject.map(coll => {

            let pricesCollection = []

            for (let i = 0; i < coll.optionChoices2.length; i++) {

                let rowPriceCollection = []
                let result;

                for (let j = 0; j < coll.optionChoices1.length; j++) {

                    // Check if there is an existing service title, service options 1 and 2, in the collection
                    result = coll.services.filter(srv => (srv.serviceOption2 == coll.optionChoices2[i] && srv.serviceOption1 == coll.optionChoices1[j] && srv.serviceTitle == coll.services[i].serviceTitle))

                    // If nothing was found, push 0; else push the result's price
                    if (result.length <= 0) {
                        rowPriceCollection.push(0)
                    } else {
                        rowPriceCollection.push(result[0].price)
                    }
                }

                // Make a 'tuple'
                pricesWithOption2 = [coll.optionChoices2[i], rowPriceCollection]

                pricesCollection.push(pricesWithOption2)
            }

            // Turn tuple into object
            pricesCollectionObject = pricesCollection.map(coll => {
                return {
                    serviceOption2: coll[0],
                    prices: coll[1]
                }
            })

            return {
                serviceTitle: coll.serviceTitle,
                optionChoices1: coll.optionChoices1,
                optionChoices2: coll.optionChoices2,
                services: pricesCollectionObject,
                specialServices: coll.specialServices
            }
        })

        res.render('services', {
            layout: 'index',
            active: { services: true },
            logged_in: req.session.logged_in,
            serviceCollections: mappedServiceCollection
        });
    },

    getServiceConcerns: async function (req, res) {
        serviceConcerns = await ServiceCollection.distinct('serviceConcern')

        res.send(serviceConcerns)
    },

    getFAQ: async function (req, res) {

        let faqs = await FAQ.find({}, '').lean();

        console.log(faqs)

        res.render('faq', {
            layout: 'index',
            active: { faq: true },
            logged_in: req.session.logged_in,
            faqs: faqs
        });
    },

    getNotifications: async function (req, res) {
        notifications = await (await Notification.find({receiver: req.session.logged_in.user.userID})).reverse()
        res.send(notifications)
    },

    findNotification: async function (req, res) {
        notification = await Notification.findOne({_id: req.query.id})

        await Notification.updateOne({_id: req.query.id}, {isRead: "true"})
        res.send(notification)
    }
}

module.exports = controller;