const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    question: {
        type: String
    },
    answer: {
        type: String
    }
});

module.exports = mongoose.model('FAQ', FAQSchema, "faq");