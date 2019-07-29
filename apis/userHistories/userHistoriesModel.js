const mongoose = require('mongoose');
const userHostoriesSchema = require('./userHistoriesSchema');
let userHostoriesModel = mongoose.model('user_histories', userHostoriesSchema, 'user_histories')

module.exports = userHostoriesModel