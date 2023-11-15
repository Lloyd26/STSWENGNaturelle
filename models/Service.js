const { Schema, SchemaTypes, model, SchemaType } = require('mongoose');

const serviceSchema = new Schema ({
    serviceTitle: {
        type: SchemaTypes.String
    },
    serviceOption1: {
        type: SchemaTypes.String
    },
    serviceOption2: {
        type: SchemaTypes.String
    },
    price: {
        type: SchemaTypes.Number
    }
})

// for MongoDB collection "reservations"
const Service = model("Service", serviceSchema, "services");
module.exports = Service;
