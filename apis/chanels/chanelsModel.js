const mongoose = require('mongoose');
const chanelsSchema = require('./chanelsSchema');
let chanelsModel = mongoose.model('chanels', chanelsSchema, 'chanels')

module.exports = chanelsModel