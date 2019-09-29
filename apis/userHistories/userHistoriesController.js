const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const userHistoriesModel = require('./userHistoriesModel')
const questionModel = require('../questions/questionsModel')
const answerModel = require('../answers/answersModel')
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

const {ROLE_USER, STATUS_QUESTION} = require('../../utils/enum')

//Lấy danh sách lịch sử chơi game
router.get('/', verifyToken, async(req, res) => {
    try
    {
        let user_id = req.user._id
        let user_request = req.query.user_request || ''
        let page = req.query.page || 0
        let limit = req.query.limit || 1000
        let date = req.query.date || ''

        let query   = {
            $and : [
                (user_request != '') ? {user_request : user_request} : {},
                (date != '') ? {content : {"$gte": date, "$lt": date.addDays(1)}} : {},
                (req.user.role != ROLE_USER.ADMIN) ? {user : user_id} : {}
            ]
        }
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            populate : [{path : 'user', select : '-password'}, {path : 'user_request', populate : {path : 'user', select : '-password'}}, 'gift'],
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await userHistoriesModel.paginate(query, options)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e)
    }
})

router.post('/', verifyToken, async(req, res) => {
    try
    {
        let obj = {
            user_request : req.body.user_request,
            user : req.user._id,
            question : req.body.question,
            answer : req.body.answer
        }
        
        //check param
        if (validateParameters([obj.user_request, obj.question, obj.answer], res) == false) 
            return

        let history = await userHistoriesModel.findOne({user : obj.user, user_request : obj.user_request}).exec()
        //Nếu chưa tồn tại thì thêm mới
        if(!history)
            await userHistoriesModel.create({user : obj.user, user_request : obj.user_request})
        //ngược lại cập nhật step 
        else
        {
            //Kiểm tra xem câu hỏi gửi lên có phải là câu hỏi hiện tại đang phát ko
            let listQuestion = await questionModel.find({user_request : obj.user_request}).exec()
            for (let i = 0; i < listQuestion.length; i++) {
                if(listQuestion[i]._id == obj.question)
                    await userHistoriesModel.findOneAndUpdate({user : obj.user, user_request : obj.user_request},  {step : i + 1}).exec()
            }
        }

        //Kiểm tra xem đáp án đúng ko. Nếu đúng thì cộng thêm điểm cho nè.
        let answer = await answerModel.findById(obj.answer).exec()
        if(answer && answer.is_true)
        {
            await userHistoriesModel.findOneAndUpdate({user : obj.user, user_request : obj.user_request},  {$inc : { score: 1 }}).exec()
        }
        
        if(answer)
        {
            await answerModel.findByIdAndUpdate(obj.answer, {$inc : { num: 1 }}).exec()
        }
            

        return success(res)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

router.get('/step', verifyToken, async(req, res) => {
    try
    {
        let user = req.user._id
        let user_request = req.query.user_request

        //check param
        if (validateParameters([user_request], res) == false) 
            return

        let history = await userHistoriesModel.findOne({user, user_request}).exec()
        let listQuestion = await questionModel.find({user_request : user_request, status : STATUS_QUESTION.ACTIVE}).exec()

        return success(res, {step : history ? history.step : 1, score : history ? history.score : 0, total_question : listQuestion.length})
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

module.exports = router
