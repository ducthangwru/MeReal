const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;

const answersSchema = new Schema(
    {
        question : {type : ObjectId, require : true, ref : 'questions'},
        content : {type : String, require : true},
        is_true : {type : Boolean, require : true},
        num : {type : Number, require : true, default : 0}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
answersSchema.plugin(mongoosePaginate)

module.exports = answersSchema