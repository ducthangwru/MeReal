const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const {STATUS_USER, TYPE_GIFT} = require('../../utils/enum')

const chanelSchedulesSchema = new Schema(
    {
        name : {type : String, require : true},
        chanel : {type : ObjectId, require : true,  ref: 'chanels'},
        desc : {type : String, require : true},
        time : {type : Date, require : true},
        questions : {type : Number, require : true},  //số lượng câu hỏi
        time_question : {type : Number, require : true, default : 10}, // thời gian trả lời mỗi câu hỏi mặc định 10s (Đơn vị giây)
        type : {type : Number, require : true, default : TYPE_GIFT.MONEY},
        status : {type : Boolean, default : STATUS_USER.ACTIVE},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

module.exports = chanelSchedulesSchema