const Admin = require('../models/Admin');
const Employee = require('../models/Employee')
const ServiceCollection = require('../models/ServiceCollection.js');
const Service = require('../models/Service.js');
const SpecialService = require('../models/SpecialService.js');
const FAQ = require('../models/FAQ.js');
const Reservation = require('../models/Reservation.js');
const InCartService = require('../models/InCartService.js');
const bcrypt = require('bcrypt');


function isEmailValid(email) {
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return validEmailRegex.test(email);
}

function isContactNumValid(contactNum) {
    const validContactNumRegex = /^(09)\d{9}/;
    return validContactNumRegex.test(contactNum);
}

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
                    persistent: true,
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

        let passwordCompare = await bcrypt.compare(password, result.password);

        if (!passwordCompare) {
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

        if (req.query.next) res.redirect(decodeURIComponent(req.query.next));
        else res.redirect('/admin');
    },

    getCurrentUser: async function(req, res){
        user = await Admin.findOne({username:req.session.logged_in.user})
        console.log(user)
        res.send(username)
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

    getAdminReservations: function (req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.redirect("/admin?next=" + encodeURIComponent("/admin/reservations"));
            return;
        }

        res.render('admin-reservations', {
            layout: 'admin',
            logged_in: req.session.logged_in,
            active: {admin_reservations: true}
        });
    },

    getAllReservations: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let reservations = await Reservation.find({}, '').populate('services');
        res.send(reservations);
    },
  
    getAdminEmployees: function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.redirect("/admin?next=" + encodeURIComponent("/admin/employees"));
            return;
        }

        res.render('admin-employees', {
            layout: 'admin',
            logged_in: req.session.logged_in,
            active: {admin_employees: true}
        });
    },

    getAllEmployees: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let employees = await Employee.find({}, '');
        res.send(employees);
    },

    postAddEmployee: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let fname = req.body.employee_fname;
        let lname = req.body.employee_lname;
        let email = req.body.employee_email;
        let contact = req.body.employee_contact;

        if (fname === undefined || lname === undefined || email === undefined || contact === undefined) {
            res.sendStatus(400); // HTTP 400: Bad Request
            return;
        } else if (fname === '' || lname === '' || email === '' || contact === '') {
            res.sendStatus(400);
            return;
        } else if (!isEmailValid(email)) {
            res.sendStatus(400).json({error: "Email address is not valid!"});
            return;
        } else if (!isContactNumValid(contact)) {
            res.sendStatus(400).json({error: "Contact number is not valid!"});
            return;
        }

        let employee = {
            firstName: fname,
            lastName: lname,
            email: email,
            contactNumber: contact
        };

        await Employee.create(employee);

        res.sendStatus(201); // HTTP 201: Created
    },

    postEditEmployee: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let id = req.body.employee_id;
        let fname = req.body.employee_fname;
        let lname = req.body.employee_lname;
        let email = req.body.employee_email;
        let contact = req.body.employee_contact;

        if (fname === undefined || lname === undefined || email === undefined || contact === undefined) {
            res.sendStatus(400); // HTTP 400: Bad Request
            return;
        } else if (fname === '' || lname === '' || email === '' || contact === '') {
            res.sendStatus(400);
            return;
        } else if (!isEmailValid(email)) {
            res.sendStatus(400).json({error: "Email address is not valid!"});
            return;
        } else if (!isContactNumValid(contact)) {
            res.sendStatus(400).json({error: "Contact number is not valid!"});
            return;
        }

        let employee = {
            firstName: fname,
            lastName: lname,
            email: email,
            contactNumber: contact
        };

        await Employee.updateOne({_id: id}, employee);

        res.sendStatus(200); // HTTP 200: OK
    },

    postDeleteEmployee: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let id = req.body.employee_id;
        let fname = req.body.employee_fname;
        let lname = req.body.employee_lname;
        let email = req.body.employee_email;
        let contact = req.body.employee_contact;

        if (fname === undefined || lname === undefined || email === undefined || contact === undefined) {
            res.sendStatus(400); // HTTP 400: Bad Request
            return;
        } else if (fname === '' || lname === '' || email === '' || contact === '') {
            res.sendStatus(400);
            return;
        } else if (!isEmailValid(email)) {
            res.sendStatus(400).json({error: "Email address is not valid!"});
            return;
        } else if (!isContactNumValid(contact)) {
            res.sendStatus(400).json({error: "Contact number is not valid!"});
            return;
        }

        let employee = {
            firstName: fname,
            lastName: lname,
            email: email,
            contactNumber: contact
        };

        await Employee.deleteOne({_id: id}, employee);

        res.sendStatus(200); // HTTP 200: OK
    },

    getAdminServices: async function(req, res, next) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.redirect("/admin?next=" + encodeURIComponent("/admin/services"));
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

        
        res.render('services-admin', {
            layout: 'admin',
            logged_in: req.session.logged_in,
            active: {admin_services: true},
            service_collections: serviceCollectionsWithTags
        });
    },

    getFindServiceCollection: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let serviceCollection = await ServiceCollection.findOne({_id: req.query.id})
        .populate('services').populate('specialServices')

        res.send(serviceCollection)
    },

    getServiceCollections: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
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
                _id: coll._id,
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
        res.send(serviceCollectionsWithTags)
    },

    postAddServiceCollection: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }
        // check if service title is unique
        let uniquecheck = await ServiceCollection.findOne({serviceTitle:req.body.serviceTitle}, 'serviceTitle')
    
        if (uniquecheck != null && uniquecheck.serviceTitle === req.body.serviceTitle) {
            res.json({hasError: true, error: "Service Title already exists!"})
            return;
        }

        // extract services and insert to DB

        if (Array.isArray(req.body.services) && req.body.services.length !== 0) {
            await Service.insertMany(req.body.services)
        }
        
        if (Array.isArray(req.body.specialServices) && req.body.specialServices.length !== 0) {
            await SpecialService.insertMany(req.body.specialServices)
        }

        let services = await Service.find({'serviceTitle': req.body.serviceTitle})
        let serviceIds = await services.map(service => service._id)
        
        let standaloneServices = await SpecialService.find({'serviceTitle': req.body.serviceTitle})
        let standaloneServiceIds = await standaloneServices.map(service => service._id)

        let newServiceCollection = {
            serviceConcern: req.body.serviceConcern,
            serviceTitle: req.body.serviceTitle,
            optionChoices1: req.body.optionChoices1,
            optionChoices2: req.body.optionChoices2,
            services: serviceIds,
            specialServices: standaloneServiceIds
        }

        await ServiceCollection.create(newServiceCollection);

        res.sendStatus(200); // HTTP 200: OK
    },

    postEditServiceCollection: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }
        
        let id = req.body.id
        
        // check if service title is unique
        let uniquecheck = await ServiceCollection.findOne({serviceTitle:req.body.serviceTitle}, 'serviceTitle')
        
        if (uniquecheck != null && uniquecheck.serviceTitle === req.body.serviceTitle && uniquecheck._id != id) {
            res.json({hasError: true, error: "Service Title already exists!"})
            return;
        }

        let service_collection_to_be_deleted = await ServiceCollection.findOne({_id:id})

        // delete existing info

        await Service.deleteMany({serviceTitle: service_collection_to_be_deleted.serviceTitle})
        await SpecialService.deleteMany({serviceTitle: service_collection_to_be_deleted.serviceTitle})

        // extract services and insert to DB

        if (Array.isArray(req.body.services) && req.body.services.length !== 0) {
            await Service.insertMany(req.body.services)
        }
        
        if (Array.isArray(req.body.specialServices) && req.body.specialServices.length !== 0) {
            await SpecialService.insertMany(req.body.specialServices)
        }

        let services = await Service.find({'serviceTitle': req.body.serviceTitle})
        let serviceIds = await services.map(service => service._id)
        
        let standaloneServices = await SpecialService.find({'serviceTitle': req.body.serviceTitle})
        let standaloneServiceIds = await standaloneServices.map(service => service._id)

        let newServiceCollection = {}

        newServiceCollection = {
            serviceConcern: req.body.serviceConcern,
            serviceTitle: req.body.serviceTitle,
            optionChoices1: req.body.optionChoices1,
            optionChoices2: req.body.optionChoices2,
            services: serviceIds,
            specialServices: standaloneServiceIds
        }
        
        await ServiceCollection.replaceOne({_id: id}, newServiceCollection);
        
        res.sendStatus(200); // HTTP 200: OK
    },

    postDeleteServiceCollection: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }
        
        let deleteServices = await Service.deleteMany({serviceTitle: req.body.serviceTitle})
        let deleteSpecialServices = await SpecialService.deleteMany({serviceTitle: req.body.serviceTitle})
        let deleteServiceCollection = await ServiceCollection.deleteOne({serviceTitle: req.body.serviceTitle})

        if (deleteServices.deletedCount > 0 || deleteSpecialServices.deletedCount > 0 || deleteServiceCollection.deletedCount > 0){
            res.sendStatus(200); // HTTP 200: OK
        }
        else {
            res.json({hasError: true, error: "Nothing to delete."});
        }
    },

    getFAQ: function (req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        res.render('faq-admin', {
            layout: 'admin',
            logged_in: req.session.logged_in,
            active: {admin_FAQ: true},
        });
    },

    getAllFAQs: async function (req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let faqs = await FAQ.find({}, '');
        res.send(faqs);
    },

    getFindFAQ: async function (req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let faq = await FAQ.findOne({_id: req.query.id});
        res.send(faq);
    },
    
    postAddFAQ: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let newFAQ = {
            question: req.body.question,
            answer: req.body.answer
        }

        await FAQ.create(newFAQ);

        res.sendStatus(200); // HTTP 200: OK
    },

    postEditFAQ: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let newFAQ = {
            question: req.body.question,
            answer: req.body.answer
        }

        await FAQ.updateOne({_id: req.body.id}, newFAQ);

        res.sendStatus(200); // HTTP 200: OK
    },

    postDeleteFAQ: async function(req, res) {
        if (!req.session.logged_in || req.session.logged_in.type !== "admin") {
            res.sendStatus(403); // HTTP 403: Forbidden
            return;
        }

        let result = await FAQ.deleteOne({_id: req.body.id});

        if(result.deletedCount > 0){
            res.sendStatus(200); // HTTP 200: OK
        } else {
            res.json({hasError: true, error: "Nothing to delete."});
        }
    } 
}

module.exports = controller;