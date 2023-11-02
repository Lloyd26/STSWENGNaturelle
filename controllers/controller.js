const controller = {
    getIndex: function(req, res) {
        res.render('main', {layout: 'index', active: {home: true}});
    },

    getLogin: function(req, res) {
        res.render('login', {layout: 'index', active: {login: true}});
    },

    getRegister: function(req, res) {
        res.render('register', {layout: 'index', active: {login: true}});
    },

    getReservation: function(req, res) {
        res.render('reservation', {layout: 'index', active: {login: true}});
    }
}

module.exports = controller;