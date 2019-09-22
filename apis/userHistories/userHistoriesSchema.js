const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userHistoriesSchema = new Schema(
    {
        user : {type : ObjectId, require : true, ref : 'users'},
        user_request : {type : ObjectId, require : true, ref : 'user_requests'},
        gift : {type : ObjectId, ref : 'gifts', default : null},
        score : {type : Number, require : true, default : 0},
        step : {type : Number, require : true, default : 1}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
userHistoriesSchema.plugin(mongoosePaginate)

module.exports = userHistoriesSchema