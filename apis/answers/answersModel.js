const mongoose = require('mongoose');
const answersSchema = require('./answersSchema');
let answersModel = mongoose.model('answers', answersSchema, 'answers')

module.exports = {
    answersModel
}