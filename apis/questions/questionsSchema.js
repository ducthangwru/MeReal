const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const {STATUS_QUESTION} = require('../../utils/enum')

const questionsSchema = new Schema(
    {
        content : {type : String, require : true},
        suggest : {type : String},
        status : {type : Boolean, default : STATUS_QUESTION.ACTIVE},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

module.exports = questionsSchema