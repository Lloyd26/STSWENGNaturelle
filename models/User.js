const { Schema, SchemaTypes, model } = require('mongoose');

const userSchema = new Schema ({
    full_name: {
        type: SchemaTypes.String
    },
    contact_num: {
        type: SchemaTypes.Number
    },
    email: {
        type: SchemaTypes.String
    },
    password: {
        type: SchemaTypes.String,
        required: true
    },

})

// for MongoDB collection "users"
const User = model("users", userSchema, "users");
module.exports = User;
