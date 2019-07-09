const mongoose = require('mongoose');
const chanelSchedulesSchema = require('./chanelSchedulesSchema');
let chanelSchedulesModel = mongoose.model('chanel_schedules', chanelSchedulesSchema, 'chanel_schedules')

module.exports = {
    chanelSchedulesModel
}