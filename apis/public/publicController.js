const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const randomString = require('randomstring')
const validator = require('validator')
const message = require('../../utils/message')
const usersModel = require('../users/usersModel')
const {
    error,
    success,
    verifyToken,
    checkRegexUsername,
    checkRegexPassword,
    md5,
    validateParameters,
    assignToken,
    sendEmailForgotPW
} = require('../../utils/utils')

//API đăng ký tài khoản
router.post('/register', async(req, res) => {
    try
    {
        let obj = {
            username : req.body.username,
            password : req.body.password,
            email : req.body.email,
            fullname : req.body.fullname,
            role : req.body.role || 1
        }

        //check param
        if (validateParameters([
            obj.username, 
            obj.password, 
            obj.fullname,
            obj.email
        ], res) == false)
            return 

        //check username
        if (!checkRegexUsername(obj.username))
            return error(res, message.INVALID_USERNAME)

        //check email
        if (!validator.isEmail(obj.email))
            return error(res, message.INVALID_EMAIL)
        
        //check password
        if (!checkRegexPassword(obj.password))
            return error(res, message.INVALID_PASSWORD)

        //check exists username or email
        if(await usersModel.findOne(
                            {
                                $or: [ 
                                    {username : obj.username},
                                    {email : obj.email}
                                ]
                            }).exec())
            return error(res, message.USER_EXISTS)
        
        //Mã hóa password
        obj.password = md5(obj.password)
        let user = await usersModel.create(obj)
        return success(res, user)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//API Đăng nhập
router.post('/login', async(req, res) => {
    try
    {
        let username = req.body.username
        let password = req.body.password

        //check param 
        if (validateParameters([username, password], res) == false) 
          return

         //check password
        if (!checkRegexPassword(password))
            return error(res, message.INVALID_PASSWORD)

        let result
        //Nếu nó là email
        if(validator.isEmail(username))
            result = await usersModel.findOne(
                                    {
                                        email : username,
                                        password : md5(password)
                                    }).exec()
        
        //Nó là username
        else if (checkRegexUsername(username))
            result = await usersModel.findOne(
                                    {
                                        username : username,
                                        password : md5(password)
                                    }).exec()

        if(result)
        {
            let token = await assignToken(result._id, result.username, result.email, result.role)
            req.session.token = token
            return success(res, {token : token, user : result})
        }
        
        return error(res, message.WRONG_USER)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//API quên mật khẩu
router.post('/forgotpwd', async(req, res) => {
    try
    {
        let email = req.body.email

        //check param
        if (validateParameters([email], res) == false) 
            return

        //Check email
        if(email && !validator.isEmail(email))
             return error(req, res, message.INVALID_EMAIL)

        //Tìm xem email có tồn tại không?
        if(await usersModel.findOne({email : email}).exec())
        {
            //Random String
            let random = randomString.generate({
                length: 6,
                charset: 'numeric'
            });

            //lưu mã code vào db
            usersModel.findOneAndUpdate({email : email}, {reset_code : random}).exec()

            sendEmailForgotPW(email, random)

             return success(res)
        }
        
         return error(res, message.USER_NOT_EXISTS)
    }
    catch(e)
    {
         return error(res, e)
    }
})

//API đặt lại mật khẩu
router.post('/resetpwd', async(req, res) => {
    try
    {
        let reset_code = req.body.reset_code
        let email = req.body.email
        let new_password = req.body.new_password

        //check param
        if (validateParameters([email, new_password, reset_code], res) == false) 
            return

        //Check email
        if(email && !validator.isEmail(email))
            return error(res, message.INVALID_EMAIL)

         //reset password
        if(await usersModel.findOneAndUpdate(
                                                {email : email, reset_code : reset_code}, 
                                                {password : md5(new_password)}
                                            ).exec())
        {
            //Nếu success đổi random mã code
            await usersModel.findOneAndUpdate(
                                                {email : email}, 
                                                {reset_code : randomString.generate({length: 6, charset: 'numeric'})}
                                            ).exec()
            return success(res)
        }
         
         return error(res, message.WRONG_RESET_CODE)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

module.exports = router