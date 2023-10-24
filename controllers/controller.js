const controller = {
    getIndex: function(req, res) {
        res.render('main', {layout: 'index', active: {home: true}});
    },

    getLogin: function(req, res) {
        res.render('login', {layout: 'index', active: {login: true}});
    }
}

module.exports = controller;