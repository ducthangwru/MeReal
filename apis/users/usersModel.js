const mongoose = require('mongoose');
const userSchema = require('./usersSchema');
let usersModel = mongoose.model('users', userSchema, 'users');

const changePassword = async(user) => {
    try
    {
       let userOld = await usersModel.findOne(
                                    {
                                        username : user.username, 
                                        password : user.password
                                    }).exec();

       if(!userOld)
       //Sai tài khoản hoặc mật khẩu
            return 0;
       else
        {
            let newUser = await usersModel.findOneAndUpdate(
                                    {
                                        username : user.username, 
                                        password : user.password
                                    }, 
                                    {
                                        password : user.newpassword
                                    }).exec();

            if(!newUser)
                return 0;

            return 1;
        }
    }
    catch(e)
    {
        return e.message;
    }
}

module.exports = {
    changePassword,
    usersModel
}