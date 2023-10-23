const controller = {
    getIndex: function(req, res) {
        res.render('main', {layout: 'index'});
    },

    getLogin: function(req, res) {
        res.render('login', {layout: 'index'});
    }
}

module.exports = controller;