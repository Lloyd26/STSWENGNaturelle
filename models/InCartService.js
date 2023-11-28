const { Schema, SchemaTypes, model } = require('mongoose');

const InCartServiceSchema = new Schema ({
    details: {
        type: SchemaTypes.String
    },
    preferredEmployee: {
        type: SchemaTypes.String
    },
    serviceTitle: {
        type: SchemaTypes.String
    }
})

const InCartService = model("InCartService", InCartServiceSchema, "inCartService");
module.exports = InCartService;
