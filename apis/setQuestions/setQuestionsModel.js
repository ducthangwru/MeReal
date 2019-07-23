const mongoose = require('mongoose');
const setQuestionsShema = require('./setQuestionsSchema');
let setQuestionsModel = mongoose.model('set_questions', setQuestionsShema, 'set_questions')

module.exports = setQuestionsModel