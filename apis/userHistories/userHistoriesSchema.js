const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userHistoriesSchema = new Schema(
    {
        user : {type : ObjectId, require : true, ref : 'users'},
        user_live : {type : ObjectId, require : true, ref : 'users'},
        gift : {type : ObjectId, ref : 'gifts'},
        score : {type : Number, require : true, default : 0},
        step : {type : Number, require : true, default : 0}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
userHistoriesSchema.plugin(mongoosePaginate)

module.exports = userHistoriesSchema