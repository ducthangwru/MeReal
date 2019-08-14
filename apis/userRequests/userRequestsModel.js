const mongoose = require('mongoose');
const userRequestsSchema = require('./userRequestsSchema');
let userRequestsModel = mongoose.model('user_requests', userRequestsSchema, 'user_requests')

module.exports = userRequestsModel