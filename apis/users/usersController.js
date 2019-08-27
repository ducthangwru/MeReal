const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const randomString = require('randomstring')
const validator = require('validator')
const message = require('../../utils/message')
const usersModel = require('./usersModel')
const {
    error,
    success,
    verifyToken,
    verifyTokenAdmin,
    verifyTokenAgent,
    verifyTokenAgentOrAdmin,
    checkRegexUsername,
    checkRegexPassword,
    md5,
    validateParameters,
    assignToken,
    sendEmailForgotPW
} = require('../../utils/utils')

const {ROLE_USER, STATUS_USER} = require('../../utils/enum')

//Chỉnh sửa profile
router.put('/profile', verifyToken, async(req, res) => {
    try
    {
        let obj = {
            fullname : req.body.fullname,
            _id : req.user._id
        }

        //Nếu nó là admin
        if(req.user.role == ROLE_USER.ADMIN)
            obj._id = req.body._id ? req.body._id : req.user._id

        //check param
        if (validateParameters([obj.fullname], res) == false) 
            return

        let user = await usersModel.findById(obj._id).exec()

        if(user)
        {
            let result = await usersModel.findByIdAndUpdate(obj._id, obj, {new: true}).exec()
            return success(res, result)
        }

        return error(res, message.USER_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Lấy thông tin profile
router.get('/profile', verifyToken, async(req, res) => {
    try
    {
        let _id = req.query._id ? req.query._id : req.user._id

        let result = await usersModel.findById(_id).exec()

        if(result)
            return success(res, result)

        return error(res, message.USER_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Đổi mật khẩu
router.put('/changepwd', verifyToken, async(req, res) => {
    try
    {
        let obj = {
            _id : req.user._id,
            old_password : req.body.old_password,
            new_password : req.body.new_password
        }

        //check param
        if (validateParameters([obj.old_password, obj.new_password], res) == false) 
            return

        if (!checkRegexPassword(obj.old_password))
            return error(res, message.INVALID_PASSWORD)

        if (!checkRegexPassword(obj.new_password))
            return error(res, message.INVALID_PASSWORD)

        let user = await usersModel.findOne({_id : obj._id, password : md5(obj.old_password)}).exec()
        if(user)
        {
            let result = await usersModel.findByIdAndUpdate(obj._id, {password : md5(obj.new_password)}, {new: true}).exec()
            return success(res, result)
        }

        return error(res, message.WRONG_PASSWORD)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin lấy danh sách user
router.get('/', verifyTokenAdmin, async(req, res) => {
    try
    {
        let fullname = req.query.fullname || ''
        let email = req.query.email || ''
        let role = req.query.role || 0
        let status = req.query.status || 0
        let page = req.query.page || 0
        let limit = req.query.limit || 1000

        let query   = {
            $and : [
                (fullname != '') ? {fullname : {$regex: fullname, $options: "i"}} : {},
                (email != '') ? {email : {$regex: email, $options: "i"}} : {},
                (role != 0) ?  {role : role} : {},
                (status != 0) ?  {status : status} : {},
            ]
        }
        
        let options = {
            select : '-password',
            sort:     { fullname: 1 },
            lean :   true,
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await usersModel.paginate(query, options)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin xóa user
router.delete('/', verifyTokenAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id
        //check param
        if (validateParameters([_id], res) == false) 
            return

        if(await usersModel.findById(_id).exec())
        {
            await usersModel.findByIdAndRemove(_id).exec()
            return success(res)
        }
        
        return error(res, message.USER_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin lock user
router.put('/status', verifyTokenAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id
        let status = req.body.status

        //check param
        if (validateParameters([_id, status], res) == false) 
            return

        if(await usersModel.findById(_id).exec())
        {
            await usersModel.findByIdAndUpdate(_id, {status}).exec()
            return success(res)
        }
        
        return error(res, message.USER_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

module.exports = router