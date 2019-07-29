const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const userQuestionsModel = require('./userQuestionsModel')

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

//lấy danh sách question trong bọ câu hỏi
router.get('/', verifyToken, async(req, res) => {
    try
    {
        let page = req.query.page || 0
        let limit = req.query.limit || 20

        let query   = {}
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            populate : 'questions',
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await userQuestionsModel.paginate(query, options)

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

        let result = await userQuestionsModel.findById(_id).populate({
            path: 'question',
            model:'questions'
        }).exec()

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent thêm câu hỏi vào bộ câu hỏi
router.post('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let obj = {
            set_question : req.body.set_question,
            question : req.body.question
        }

         //check param
        if (validateParameters([obj.question, obj.set_question], res) == false) 
            return

        let result = await userQuestionsModel.create(obj)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

//agent admin xóa câu hỏi trong bộ câu hỏi
router.delete('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id

        //check param
        if (validateParameters([_id], res) == false) 
            return

        if(await userQuestionsModel.findById(_id).exec())
        {
            await userQuestionsModel.findByIdAndRemove(_id).exec()
            return success(res)
        }
            
        return error(res, message.QUESTION_NOT_EXISTS)

    }
    catch(e)
    {
        return error(res, e.message)
    }
})
