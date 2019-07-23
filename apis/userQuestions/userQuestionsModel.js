const mongoose = require('mongoose');
const userQuestionsShema = require('./userQuestionsShema');
let userQuestionsModel = mongoose.model('user_questions', userQuestionsShema, 'user_questions')

module.exports = userQuestionsModel