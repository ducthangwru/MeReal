const mongoose = require('mongoose');
const chanelScheduleQuestionsSchema = require('./chanelScheduleQuestionsSchema');
let chanelScheduleQuestionsModel = mongoose.model('chanel_schedule_questions', chanelScheduleQuestionsSchema, 'chanel_schedule_questions')

module.exports = {
    chanelScheduleQuestionsModel
}