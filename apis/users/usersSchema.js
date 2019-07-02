const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const {STATUS_USER, ROLE_USER} = require('../../utils/enum')

const usersSchema = new Schema(
    {
        username : {type : String, require : true},
        password : {type : String, require : true},
        fullname : {type : String, require : true},
        is_online : {type: Boolean},
        avatar : {type: String},
        email : {type : String},
        status : {type : Number, default : STATUS_USER.ACTIVED},
        role : {type : Number, default : ROLE_USER.USER},
        wallet : {type : Number, default : 0}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);

let usersModel = mongoose.model('users', usersSchema, 'users');

usersSchema.pre('save', function(next) {
    let user = this;
    usersModel.find({username : user.username}, function (err, docs) {
        if (!docs.length){
            next();
        }else{                
            next(new Error("User exists!"));
        }
    });
});

module.exports = usersSchema;