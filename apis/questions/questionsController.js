const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const questionModel = require('./questionsModel')
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

const {STATUS_QUESTION} = require('../../utils/enum')

//getQuestion
router.get('/', verifyToken, async(req, res) => {
    try
    {
        let search = req.query.search || ''
        let page = req.query.page || 0
        let limit = req.query.limit || 20

        let query   = {
            $and : [
                (search != '') ? {content : {$regex: search, $options: "i"}} : {}
            ]
        }
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await questionModel.paginate(query, options)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin thêm câu hỏi
router.post('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let obj = {
            content : req.body.content,
            suggest : req.body.suggest
        }

         //check param
        if (validateParameters([obj.content, obj.suggest], res) == false) 
            return

        let result = await questionModel.create(obj)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin sửa question
router.put('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id
        let content = req.body.content
        let suggest = req.body.suggest

         //check param
        if (validateParameters([_id, content, suggest], res) == false) 
            return

        let result = await questionModel.findByIdAndUpdate(_id, {content, suggest}, {new : true}).exec()

        if(result)
            return success(res, result)
        
        return error(res, message.QUESTION_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin xóa câu hỏi
router.delete('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id

        //check param
        if (validateParameters([_id], res) == false) 
            return

        if(await questionModel.findById(_id).exec())
        {
            await questionModel.findByIdAndRemove(_id).exec()
            return success(res)
        }
            
        return error(res, message.QUESTION_NOT_EXISTS)

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

        if(await questionModel.findById(_id).exec())
        {
            await questionModel.findByIdAndUpdate(_id, {status}).exec()
            return success(res)
        }
        
        return error(res, message.QUESTION_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

module.exports = router