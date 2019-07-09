const mongoose = require('mongoose');
const chanelGiftsSchema = require('./chanelGiftsSchema');
let chanelGiftsModel = mongoose.model('chanel_gifts', chanelGiftsSchema, 'chanel_gifts')

module.exports = {
    chanelGiftsModel
}