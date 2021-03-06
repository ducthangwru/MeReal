const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const questionModel = require('./questionsModel')
const answerModel = require('../answers/answersModel')
const userRequestModel = require('../userRequests/userRequestsModel')
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

const {STATUS_QUESTION, STATUS_USER_REQUEST} = require('../../utils/enum')

//getQuestion
router.get('/', verifyToken, async(req, res) => {
    try
    {
        let search = req.query.search || ''
        let _id = req.query._id
        let page = req.query.page || 0
        let limit = req.query.limit || 1000

         //check param
        if (validateParameters([_id], res) == false) 
            return

        let query   = {
            $and : [
                (search != '') ? {content : {$regex: search, $options: "i"}} : {},
                {user_request : _id}
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

router.get('/details', verifyTokenAgent, async(req, res) => {
    try
    {
        let user = req.user._id
        let user_request = req.query.user_request
        let index = req.query.index || 0

         //check param
        if (validateParameters([user, user_request, index], res) == false) 
            return
        
        // Kiểm tra xem đã đến câu bao nhiêu
        let userRequest = await userRequestModel.findById(user_request).exec()

        index = (userRequest && index == 0) ? userRequest.step + 1 : index

        let result = await questionModel.find({user, user_request, status : STATUS_QUESTION.ACTIVE}).exec()

        if(index >= result.length)
            return success(res, {question : null, answers : null, length : result.length, index : parseInt(index)})

        let answers = await answerModel.find({question : result[index]._id}).select('-is_true').exec()
        await userRequestModel.findByIdAndUpdate(user_request, {step : index}).exec()

        return success(res, {question : result[index], answers : answers, length : result.length, index : parseInt(index)})
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent thêm câu hỏi
router.post('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let obj = {
            content : req.body.content,
            suggest : req.body.suggest || '',
            status : req.body.status,
            user : req.user._id,
            user_request : req.body.user_request
        }

         //check param
        if (validateParameters([obj.content, obj.user_request, obj.status], res) == false) 
            return

        let userRequest = await userRequestModel.findById({_id : obj.user_request}).exec()

        if(userRequest.status == STATUS_USER_REQUEST.PLAYED)
            return error(res, message.LIVESTREAM_PLAYED)

        let result = await questionModel.create(obj)
        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Admin sửa question
router.put('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let _id = req.body._id
        let content = req.body.content
        let suggest = req.body.suggest || ''
        let status = req.body.status

         //check param
        if (validateParameters([_id, content,status], res) == false) 
            return

        let question = await questionModel.findById(_id).exec()
        let userRequest = await userRequestModel.findById({_id : question.user_request}).exec()

        if(userRequest.status == STATUS_USER_REQUEST.PLAYED)
            return error(res, message.LIVESTREAM_PLAYED)

        let result = await questionModel.findByIdAndUpdate(_id, {content, suggest, status}, {new : true}).exec()
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
router.delete('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let _id = req.body._id
        let user = req.user._id

        //check param
        if (validateParameters([_id], res) == false) 
            return

        if(await questionModel.findById(_id).exec())
        {
            await questionModel.findOneAndRemove({_id, user}).exec()
            await answerModel.deleteMany({question : _id}).exec()
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