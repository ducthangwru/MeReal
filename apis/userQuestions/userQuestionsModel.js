const mongoose = require('mongoose');
const userQuestionsShema = require('./userQuestionsSchema');
let userQuestionsModel = mongoose.model('user_questions', userQuestionsShema, 'user_questions')

module.exports = userQuestionsModel