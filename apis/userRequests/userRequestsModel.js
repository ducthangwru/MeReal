const mongoose = require('mongoose');
const userRequestsSchema = require('./userRequestsSchema');
let userRequestsModel = mongoose.model('set_questions', userRequestsSchema, 'set_questions')

module.exports = userRequestsModel