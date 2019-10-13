const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const {STATUS_USER, ROLE_USER} = require('../../utils/enum')

const usersSchema = new Schema(
    {
        username : {type : String, require : true},
        password : {type : String, require : true},
        fullname : {type : String, require : true},
        avatar : {type: String, require : true, default : null},
        email : {type : String, require : true},
        reset_code : {type : String, default : null},
        status : {type : Number, require : true, default : STATUS_USER.ACTIVE},
        role : {type : Number, require : true, default : ROLE_USER.USER}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
)

const mongoosePaginate = require('mongoose-paginate')
usersSchema.plugin(mongoosePaginate)

let usersModel = mongoose.model('users', usersSchema, 'users')

usersSchema.pre('save', function(next) {
    let user = this
    usersModel.find( {$or: [{username : user.username}, {email : user.email}]}, function (e, docs) {
        if (!docs.length){
            next()
        }else{                
            next(new Error("User exists!"))
        }
    })
})

usersSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
})

module.exports = usersSchema