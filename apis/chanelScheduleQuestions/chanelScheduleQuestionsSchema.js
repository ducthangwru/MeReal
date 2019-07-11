const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;

const answersSchema = new Schema(
    {
        question : {type : ObjectId, require : true, ref : 'questions'},
        chanel_schedule : {type : ObjectId, require : true, ref : 'chanel_schedules'}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
answersSchema.plugin(mongoosePaginate)

module.exports = answersSchema