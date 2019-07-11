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

const {ROLE_USER} = require('../../utils/enum')

//Chỉnh sửa profile
router.put('/profile', verifyToken, async(req, res) => {
    try
    {
        let obj = {
            fullname : req.body.fullname,
            email : req.body.email,
            _id : req.user._id
        }

        //Nếu nó là admin
        if(req.user.role == ROLE_USER.ADMIN)
            obj._id = req.body._id

        //check param
        if (validateParameters([obj.fullname, obj.email], res) == false) 
            return

        let user = await usersModel.findById(obj._id).exec()
        //check trùng email
        if(user.email != obj.email && await usersModel.findOne({email : obj.email}).exec())
            return error(res, message.EMAIL_EXISTS)

        let result = await usersModel.findByIdAndUpdate(obj._id, obj, {new: true}).exec()

        if(result)
        {
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

//Admin lấy danh sách user
router.get('/', verifyTokenAdmin, async(req, res) => {
    try
    {
        let fullname = req.query.fullname || ''
        let email = req.query.email || ''
        let role = req.query.role || 0
        let status = req.query.status || 0
        let page = req.query.page || 0
        let limit = req.query.limit || 20

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

module.exports = router