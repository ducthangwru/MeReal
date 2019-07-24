const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userHistoriesSchema = new Schema(
    {
        set_question : {type : ObjectId, require : true,  ref: 'set_questions'},
        user : {type : ObjectId, require : true, ref : 'users'},
        score : {type : Number, require : true, default : 0},
        step : {type : Number, require : true, default : 0}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
userHistoriesSchema.plugin(mongoosePaginate)

module.exports = userHistoriesSchema