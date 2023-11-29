const { Schema, SchemaTypes, model } = require('mongoose');

const reservationSchema = new Schema({
    timestamp: {
        type: SchemaTypes.String
    },
    services: {
        type: [SchemaTypes.Mixed],
        required: true
    },
    status: {
        type: SchemaTypes.String,
    }
})

// for MongoDB collection "reservations"
const Reservation = model("reservations", reservationSchema, "reservations");
module.exports = Reservation;
