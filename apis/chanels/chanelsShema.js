const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const {STATUS_CHANEL} = require('../../utils/enum')

const chanelsShema = new Schema(
    {
        name : {type : String, require : true},
        user : {type : ObjectId, require : true,  ref: 'users'},
        desc : {type : String, require : true},
        status : {type : Boolean, default : STATUS_CHANEL.ACTIVE},
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
chanelsShema.plugin(mongoosePaginate)

let chanelsModel = mongoose.model('chanels', usersSchema, 'chanels')

chanelsShema.pre('save', function(next) {
    let chanel = this;
    chanelsModel.find().populate({path: 'users'}).exec(function(e, chanels) {
        chanels = chanels.filter(function(c) {
            if(c.user == chanel.user)
                next(new Error("User exists in other chanel!"))
        })
        next()
    })
})

module.exports = chanelsShema