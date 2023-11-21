const mongoose = require('mongoose');

const ServiceCollection = require('../models/ServiceCollection.js');

const helpers = {
    insertOne: async function(model, doc) {
        return await model.create(doc);
    },

    insertMany: async function(model, docs) {
        return await model.insertMany(docs);
    },

    findOne: async function(model, query, projection) {
        return await model.findOne(query, projection);
    },

    findMany: async function(model, query, projection) {
        return await model.find(query, projection);
    },

    updateOne: async function(model, filter, update) {
        return await model.updateOne(filter, update);
    },

    updateMany: async function(model, filter, update) {
        return await model.updateMany(filter, update);
    },

    deleteOne: async function(model, conditions) {
        return await model.deleteOne(conditions);
    },

    deleteMany: async function(model, conditions) {
        return await model.deleteMany(conditions);
    }
}

module.exports = helpers;