const controller = {
    getIndex: function(req, res) {
        res.render('main', {layout: 'index'});
    }
}

module.exports = controller;