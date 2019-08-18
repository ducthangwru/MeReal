const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const {STATUS_USER_REQUEST} = require('../../utils/enum')
const userRequestsSchema = new Schema(
    {
        gift : {type : ObjectId, require : true,  ref: 'gifts'},
        user : {type : ObjectId, require : true, ref: 'users'},
        top_win : {type : Number, require : true, default : 0},
        price : {type : Number, require : true, default : 0},
        time : {type : String, require : true},
        date : {type : Date, require : true},
        desc : {type : String, require : true, default : ''},
        status : {type : Number, require : true, default : STATUS_USER_REQUEST.SAVE}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
userRequestsSchema.plugin(mongoosePaginate)

module.exports = userRequestsSchema