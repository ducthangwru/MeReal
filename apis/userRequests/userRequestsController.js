const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const userRequestsModel = require('./userRequestsModel')
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

const {ROLE_USER} = require('../../utils/enum')

//Lấy danh sách bộ câu hỏi theo user
router.get('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let user_id = req.user._id
        let search = req.query.search || ''
        let page = req.query.page || 0
        let limit = req.query.limit || 20

        if(req.user.role == ROLE_USER.ADMIN)
            user_id = req.query._id

        let query   = {
            $and : [
                (search != '') ? {desc : {$regex: search, $options: "i"}} : {},
                {user : user_id}
            ]
        }
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await userRequestsModel.paginate(query, options)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent thêm yêu cầu
//Chưa xác thực đã tồn tại yêu cầu ngày đó hay chưa hoặc thời gian đó đã được admin duyệt của người khác chưa
router.post('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let obj = {
            gift : req.body.gift,
            user : req.user._id,
            top_win : req.body.top_win || 0,
            desc : req.body.desc,
            price : req.body.price,
            time : req.body.time,
            date : req.body.date
        }
        
        //check param
        if (validateParameters([obj.gift, obj.user, obj.desc, obj.price, obj.time, obj.date], res) == false) 
            return

        let result = await userRequestsModel.create(obj)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent hoặc admin sửa bộ câu hỏi
router.put('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let obj = {
            _id : req.body._id,
            gift : req.body.gift,
            user : req.user.user_id,
            top_win : req.body.top_win || 0,
            desc : req.body.desc
        }

        if(req.user.role == ROLE_USER.ADMIN)
            obj.user = req.body.user_id

        //check param
        if (validateParameters([obj.gift, obj.user, obj.desc], res) == false) 
            return

        let result = await userRequestsModel.findByIdAndUpdate(obj._id, obj, {new : true}).exec()

        if(result)
            return success(res, result)
        
        return error(res, message.SET_QUESTION_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent hoặc admin xóa bộ câu hỏi
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

        if(await userRequestsModel.findById(_id).exec())
        {
            await userRequestsModel.findOneAndRemove({_id : _id, user : user_id}).exec()
            return success(res)
        }
            
        return error(res, message.SET_QUESTION_NOT_EXISTS)

    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin đổi trạng thái câu hỏi
router.put('/status', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id
        let status = req.body.status

        //check param
        if (validateParameters([_id, status], res) == false) 
            return

        if(await userRequestsModel.findById(_id).exec())
        {
            await userRequestsModel.findByIdAndUpdate(_id, {status}).exec()
            return success(res)
        }
        
        return error(res, message.SET_QUESTION_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

module.exports = router