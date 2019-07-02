const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const chanelGiftsShema = new Schema(
    {
        name : {type : String, require : true},
        chanel_schedule : {type : ObjectId, require : true,  ref: 'chanel_schedules'},
        top_to : {type : Number, require : true, default : 0},
        top_from : {type : Number, require : true, default : 0},
        desc : {type : String, require : true},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

module.exports = chanelGiftsShema