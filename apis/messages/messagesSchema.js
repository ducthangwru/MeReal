const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const messagesSchema = new Schema(
    {
        user_from : {type : ObjectId, require : true, ref : 'users'},
        user_to : {type : ObjectId, require : true, ref : 'users'},
        content : {type : String, require : true}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
messagesSchema.plugin(mongoosePaginate)

module.exports = messagesSchema