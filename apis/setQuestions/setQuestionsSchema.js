const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const setQuestionsShema = new Schema(
    {
        gift : {type : ObjectId, require : true,  ref: 'gifts'},
        user : {type : ObjectId, require : true, ref: 'users'},
        top_to : {type : Number, require : true, default : 0},
        top_from : {type : Number, require : true, default : 0},
        name : {type : String, require : true},
        desc : {type : String, require : true, default : ''},
        status : {type : Number, require : true, default : 1}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
setQuestionsShema.plugin(mongoosePaginate)

module.exports = setQuestionsShema