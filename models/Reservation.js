const { Schema, SchemaTypes, model } = require('mongoose');

const reservationsSchema = new Schema ({

    timestamp:{
        type: SchemaTypes.Date
    },
    services:{
        type: [SchemaTypes.ObjectId],
        ref: 'InCartService'
    },
    status:{
        type: SchemaTypes.String
    }
})

// for MongoDB collection "reservations"
const Reservation = model("reservations", reservationsSchema, "reservations");
module.exports = Reservation;
