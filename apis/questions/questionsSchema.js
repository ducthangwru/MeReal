const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const {STATUS_QUESTION} = require('../../utils/enum')

const questionsSchema = new Schema(
    {
        user_request : {type : Object, require : true, ref : 'user_requests'},
        user : {type : ObjectId, require : true, ref : 'users'},
        content : {type : String, require : true},
        suggest : {type : String},
        status : {type : Number, default : STATUS_QUESTION.ACTIVE},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
questionsSchema.plugin(mongoosePaginate)

module.exports = questionsSchema