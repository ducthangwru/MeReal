const mongoose = require('mongoose');
const userSchema = require('./usersSchema');
let usersModel = mongoose.model('users', userSchema, 'users');

const createUser = async (user) => {
    try
    {
        return await usersModel.create(user);
    }
    catch(err)
    {
        return err.message;
    }
}

const updateUser = async (user) => {
    try
    {
        var id = user._id;

        var queryUpdate = {
            email : user.email,
            fullname : user.fullname,
            avatar : user.avatar,
            email : user.email
        }
    
        return await usersModel.findOneAndUpdate(id, queryUpdate).exec();
    }
    catch(err)
    {
        return err.message;
    }
}

const selectUser = async (user) => {
    try
    {
        var queryFind = {
            username : user.username,
            password : user.password,
        }
    
        return await usersModel.findOne(queryFind).exec();
    }
    catch(err)
    {
        return null;
    }
}

const updateTokenFirebaseUser = async (iduser, tokenfirebase) => {
    try
    {
       return await usersModel.findOneAndUpdate(iduser, {tokenfirebase : tokenfirebase}).exec();
    }
    catch(err)
    {
        return null;
    }
}

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
    catch(err)
    {
        return err.message;
    }
}

module.exports = {
    createUser, 
    updateUser, 
    selectUser,  
    updateTokenFirebaseUser, 
    changePassword
}