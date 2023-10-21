const { Schema, SchemaTypes, model } = require('mongoose');

const productSchema = new Schema ({
    productName: {
        type: SchemaTypes.String
    },
    category: {
        type: SchemaTypes.String
    },
    price: {
        type: SchemaTypes.Number
    },
    productID: {
        type: SchemaTypes.String
    }
})

// for MongoDB collection "reservations"
const Product = model("products", productSchema, "products");
module.exports = Product;
