const { Schema, SchemaTypes, model } = require('mongoose');

const reservationSchema = new Schema ({
    customerName: {
        type: SchemaTypes.String
    },
    customerContact: {
        type: SchemaTypes.Number
    },
    customerEmail: {
        type: SchemaTypes.String
    },
    productID: {
        type: SchemaTypes.String
    },
    reserveDate: {
        type: SchemaTypes.Date
    },
    personnel: {
        type: SchemaTypes.String
    }

})

// for MongoDB collection "reservations"
const Reservation = model("reservations", reservationSchema, "reservations");
module.exports = Reservation;
