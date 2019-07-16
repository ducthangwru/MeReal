const mongoose = require('mongoose');
const giftsSchema = require('./giftsSchema');
let giftsModel = mongoose.model('gifts', giftsSchema, 'gifts')

module.exports = giftsModel