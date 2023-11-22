const Admin = require('../models/Admin');
const ServiceCollection = require('../models/ServiceCollection.js');
const Service = require('../models/Service.js');
const helpers = require('../models/helpers.js')

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
    },

    getAdminServices: async function(req, res, next) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            next();
            return;
        }

        let serviceCollections = await ServiceCollection.find({
        }).populate('services', 'specialServices').lean().exec()

        let serviceCollectionsWithTags = serviceCollections.map(coll=>{
            optionChoices1Tags = []
            optionChoices2Tags = []

            if (coll.optionChoices1.length > 3){
                for (let i = 0; i < 3; i++){
                    optionChoices1Tags[i] = coll.optionChoices1[i]
                }
            } else {
                for (let i = 0; i < coll.optionChoices1.length; i++){
                    optionChoices1Tags[i] = coll.optionChoices1[i]
                }
            }

            if (coll.optionChoices2.length > 3){
                for (let i = 0; i < 3; i++){
                    optionChoices2Tags[i] = coll.optionChoices2[i]
                }
            } else {
                for (let i = 0; i < coll.optionChoices2.length; i++){
                    optionChoices2Tags[i] = coll.optionChoices2[i]
                }
            }

            return {
                serviceConcern: coll.serviceConcern,
                serviceTitle: coll.serviceTitle,
                services: coll.services,
                optionChoices1: coll.optionChoices1,
                optionChoices2: coll.optionChoices2,
                specialServices: coll.specialServices,
                optionChoices1Tags: optionChoices1Tags,
                optionChoices2Tags: optionChoices2Tags
            }
        })

        console.log(serviceCollectionsWithTags)
        res.render('services-admin', {
            layout: 'admin',
            logged_in: req.session.logged_in,
            active: {admin_services: true},
            service_collections: serviceCollectionsWithTags
        });
    },

    postAddServiceCollection: async function(req, res) {

        // extract services and insert to DB

        let response1 = await helpers.insertMany(Service, req.body.services)

        let services = await Service.find({'serviceTitle': req.body.serviceTitle})
        let serviceIds = await services.map(service => service._id)
        
        let newServiceCollection = {
            serviceConcern: req.body.serviceConcern,
            serviceTitle: req.body.serviceTitle,
            optionChoices1: req.body.optionChoices1,
            optionChoices2: req.body.optionChoices2,
            services: serviceIds,
            specialServices: []
        }

        var response2 = await helpers.insertOne(ServiceCollection, newServiceCollection);

        if (response1 != null || response2 != null){
            res.redirect('/admin/services');
        }
    }
}

module.exports = controller;