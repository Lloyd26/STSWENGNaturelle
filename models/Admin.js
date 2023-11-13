const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// for MongoDB collection "users"
//const User = model("users", userSchema, "users");
module.exports = mongoose.model('Admin', AdminSchema, "admins");