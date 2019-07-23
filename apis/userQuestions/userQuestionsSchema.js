const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userQuestionsShema = new Schema(
    {
        set_question : {type : ObjectId, require : true,  ref: 'set_questions'},
        question : {type : ObjectId, require : true, ref: 'questions'},
        name : {type : String, require : true},
        desc : {type : String, require : true, default : ''},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
userQuestionsShema.plugin(mongoosePaginate)

module.exports = userQuestionsShema