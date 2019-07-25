const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const chanelModel = require('../chanels/chanelsModel')
const {
    error,
    success,
    verifyToken,
    verifyTokenAdmin,
    verifyTokenAgent,
    verifyTokenAgentOrAdmin,
    validateParameters,
    assignToken
} = require('../../utils/utils')

//lấy danh sách chanel
router.get('/', verifyToken, async(req, res) => {
    try
    {
        let page = req.query.page || 0
        let limit = req.query.limit || 20

        let query   = {}
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await chanelModel.paginate(query, options)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent tạo chanel
router.post('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let obj = {
            name : req.body.name,
            user : req.user.user_id,
            desc : req.body.desc
        }

        if(req.user.role == ROLE_USER.ADMIN)
            obj.user = req.body.user_id
         //check param
        if (validateParameters([obj.name, obj.desc], res) == false) 
            return

        let result = await chanelModel.create(obj)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent sửa chanel
router.put('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let obj = {
            _id : req.body._id,
            name : req.body.name,
            user : req.user.user_id,
            desc : req.body.desc
        }

        if(req.user.role == ROLE_USER.ADMIN)
            obj.user = req.body.user_id
         //check param
        if (validateParameters([obj._id, obj.name, obj.desc], res) == false) 
            return

        let result = await chanelModel.findByIdAndUpdate(obj._id, obj, {new : true}).exec()

        if(result)
            return success(res, result)
    
        return error(res, message.CHANEL_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent admin xóa chanel
router.delete('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id
        let user_id = req.user.user_id

        if(req.user.role == ROLE_USER.ADMIN)
            user_id = req.body.user_id

        //check param
        if (validateParameters([_id, user_id], res) == false) 
            return

        if(await chanelModel.findById(_id).exec())
        {
            await chanelModel.findOneAndRemove({_id : _id, user : user_id}).exec()
            return success(res)
        }
            
        return error(res, message.CHANEL_NOT_EXISTS)

    }
    catch(e)
    {
        return error(res, e.message)
    }
})


module.exports = router