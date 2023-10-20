const mongoose = require('mongoose');

function connect() {
    return mongoose.connect(process.env.MONGODB_URI);
}

module.exports = connect;
