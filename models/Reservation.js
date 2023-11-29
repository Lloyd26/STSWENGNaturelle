const { Schema, Types, model } = require('mongoose');

const reservationSchema = new Schema({
    timestamp: {
        type: Schema.Types.String
    },
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'InCartService' // Reference to the model that represents the service (replace with the actual model name)
    }],
    status: {
        type: Schema.Types.String,
    }
})

// for MongoDB collection "reservations"
const Reservation = model("reservations", reservationSchema, "reservations");
module.exports = Reservation;
