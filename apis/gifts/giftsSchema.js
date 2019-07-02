const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const {STATUS_GIFT, TYPE_GIFT} = require('../../utils/enum')

const giftsSchema = new Schema(
    {
        name : {type : String, require : true},
        desc : {type : String, require : true},
        type : {type : Number, require : true, default : TYPE_GIFT.MONEY},
        price : {type : Number, require : true},
        status : {type : Boolean, default : STATUS_GIFT.ACTIVE},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

module.exports = giftsSchema