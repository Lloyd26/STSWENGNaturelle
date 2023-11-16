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

        // Find all Nail related services
        let nailServiceCollections = await ServiceCollection.find({
            serviceConcern: "Nails"
        }).populate('services')

        let pricesCollectionObject = [];
        let pricesWithOption2 = [];

        // Transform to JSON object
        let nailServiceCollectionsObject = nailServiceCollections.map(coll => coll.toObject());

        // Check each service option combination
        let mappedNailServiceCollection = nailServiceCollectionsObject.map(coll=> {
            
            let pricesCollection = []

            for (let i = 0; i < coll.optionChoices2.length; i++){

                let rowPriceCollection = []
                let result;

                for (let j = 0; j < coll.optionChoices1.length; j++){

                    // Check if there is an existing service title, service options 1 and 2, in the collection
                    result = coll.services.filter(srv => (srv.serviceOption2 == coll.optionChoices2[i] && srv.serviceOption1 == coll.optionChoices1[j] && srv.serviceTitle == coll.services[i].serviceTitle))
                    
                    // If nothing was found, push 0; else push the result's price
                    if (result.length <= 0){
                        rowPriceCollection.push(0)
                    } else {
                        rowPriceCollection.push(result[0].price)
                    }
                }

                // Make a 'tuple'
                pricesWithOption2 = [coll.optionChoices2[i], rowPriceCollection]

                pricesCollection.push(pricesWithOption2)
            }

            console.log(pricesCollection)

            // Turn tuple into object
            pricesCollectionObject = pricesCollection.map(coll => {
                return{
                    serviceOption2: coll[0],
                    prices: coll[1]
                }
            })
            
            return {
                serviceTitle: coll.serviceTitle,
                optionChoices1: coll.optionChoices1,
                optionChoices2: coll.optionChoices2,
                services: pricesCollectionObject
            }
        })

        res.render('services', {
            layout: 'index',
            active: {services: true},
            loginType: req.session.loginType,
            logged_in: {
                state: req.session.logged_in,
                user: req.session.user
            },
            serviceCollections: mappedNailServiceCollection
        });
    }
}

module.exports = controller;