const mongoose = require('mongoose');
const questionsSchema = require('./questionsSchema');
let questionModel = mongoose.model('questions', questionsSchema, 'questions')

module.exports = {
    questionModel
}