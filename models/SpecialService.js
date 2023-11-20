const { Schema, SchemaTypes, model, SchemaType } = require('mongoose');

const specialServiceSchema = new Schema ({
    serviceTitle: {
        type: SchemaTypes.String
    },
    serviceOption: {
        type: SchemaTypes.String
    },
    price: {
        type: SchemaTypes.Number
    }
})

const SpecialService = model("SpecialService", specialServiceSchema, "specialServices");
module.exports = SpecialService;
