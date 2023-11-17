const { Schema, SchemaTypes, model, SchemaType } = require('mongoose');

const serviceCollectionSchema = new Schema ({
    serviceConcern: {
        type: SchemaTypes.String
    },
    serviceTitle: {
        type: SchemaTypes.String
    },
    optionChoices1: {
        type: [SchemaType.String]
    },
    optionChoices2: {
        type: [SchemaType.String]
    },
    services: {
        type: [SchemaTypes.ObjectId],
        ref: "Service"
    }
})

// for MongoDB collection "reservations"
const ServiceCollection = model("ServiceCollection", serviceCollectionSchema, "serviceCollections");
module.exports = ServiceCollection;