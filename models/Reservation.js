const { Schema, Types, model } = require('mongoose');

const InCartService = require('../models/InCartService');

const reservationSchema = new Schema({
    currentUserID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    timestamp: {
        type: Schema.Types.String
    },
    services: [{
        type: Schema.Types.Mixed,
        ref: "InCartService" // Reference to the model that represents the service (replace with the actual model name)
    }],
    status: {
        type: Schema.Types.String,
    }
})

// for MongoDB collection "reservations"
const Reservation = model("reservations", reservationSchema, "reservations");
module.exports = Reservation;
