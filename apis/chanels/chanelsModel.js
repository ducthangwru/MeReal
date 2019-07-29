const mongoose = require('mongoose');
const chanelsSchema = require('./chanelsShema');
let chanelsModel = mongoose.model('chanels', chanelsSchema, 'chanels')

module.exports = chanelsModel