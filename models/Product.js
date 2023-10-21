const { Schema, SchemaTypes, model } = require('mongoose');

const productSchema = new Schema ({
    productID: {
        type: SchemaTypes.String
    },
    productName: {
        type: SchemaTypes.String
    },
    category: {
        type: SchemaTypes.String
    },
    price: {
        type: SchemaTypes.Number
    }
})

// for MongoDB collection "reservations"
const Product = model("products", productSchema, "products");
module.exports = Product;
