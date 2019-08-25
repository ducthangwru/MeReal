const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const answerModel = require('./answersModel')

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

//lấy danh sách answers
router.get('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let page = req.query.page || 0
        let limit = req.query.limit || 20
        let _id = req.query._id

        //check param
        if (validateParameters([_id], res) == false) 
            return

        let query   = {
            question : _id
        }
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await answerModel.paginate(query, options)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

router.get('/details', verifyToken, async(req, res) => {
    try
    {
        let _id = req.query._id

        let result = await answerModel.findById(_id).exec()

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent tạo answers
router.post('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let obj = {
            question : req.body.question,
            content : req.body.content,
            is_true : req.body.is_true,
        }

        //check param
        if (validateParameters([obj.question, obj.content, obj.is_true], res) == false) 
            return

        if(obj.is_true == true)
            await answerModel.updateMany({question}, {is_true : false}).exec()

        let result = await answerModel.create(obj)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent sửa answers
router.put('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let obj = {
            _id : req.body._id,
            question : req.body.question,
            content : req.body.content,
            is_true : req.body.is_true
        }

         //check param
        if (validateParameters([obj._id, obj.content, obj.is_true, obj.question], res) == false) 
            return

        if(obj.is_true == true)
            await answerModel.updateMany({question}, {is_true : false}).exec()

        let result = await answerModel.findByIdAndUpdate(obj._id, obj, {new : true}).exec()

        if(result)
            return success(res, result)
    
        return error(res, message.ANSWER_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent admin xóa answers
router.delete('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id

        //check param
        if (validateParameters([_id], res) == false) 
            return

        if(await answerModel.findById(_id).exec())
        {
            await answerModel.findByIdAndRemove(_id).exec()
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