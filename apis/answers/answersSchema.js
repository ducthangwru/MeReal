const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;

const answersSchema = new Schema(
    {
        question : {type : ObjectId, require : true, ref : 'questions'},
        content : {type : String, require : true},
        is_true : {type : Boolean, require : true},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

module.exports = answersSchema