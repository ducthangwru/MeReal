const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const moment = require('moment')
const userRequestsModel = require('./userRequestsModel')
const userHistoryModel = require('../userHistories/userHistoriesModel')
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

const {ROLE_USER, STATUS_USER_REQUEST, LIVESTREAM_TIME_ENUM, TYPE_GIFT} = require('../../utils/enum')

//Lấy danh sách các request
router.get('/', verifyTokenAgentOrAdmin, async(req, res) => {
    try
    {
        let user_id = req.user._id
        let search = req.query.search || ''
        let page = req.query.page || 0
        let limit = req.query.limit || 1000

        let query   = {
            $and : [
                (search != '') ? {desc : {$regex: search, $options: "i"}} : {},
                (req.user.role != ROLE_USER.ADMIN) ? {user : user_id} : {},
                //(req.user.role == ROLE_USER.ADMIN) ? {status : { $ne:  STATUS_USER_REQUEST.SAVE}} : {}
            ]
        }
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            populate: [{path : 'user', select: '-password'}, 'gift'],
            select: '-user.password',
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
            date : req.body.date,
            status : req.body.status
        }
        
        //check param
        if (validateParameters([obj.gift, obj.user, obj.desc, obj.price, obj.time, obj.date, obj.status], res) == false) 
            return

        obj.date = moment(obj.date, 'DD/MM/YYYY').add(1, 'days')

        let result = await userRequestsModel.create(obj)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent sửa request
router.put('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let obj = {
            gift : req.body.gift,
            user : req.user._id,
            top_win : req.body.top_win || 0,
            desc : req.body.desc,
            price : req.body.price,
            time : req.body.time,
            date : req.body.date,
            status : req.body.status,
            _id : req.body._id,
            user : req.user._id
        }
        
        //check param
        if (validateParameters([obj._id, obj.gift, obj.user, obj.desc, obj.price, obj.time, obj.date, obj.status], res) == false) 
            return

        let result = await userRequestsModel.findOneAndUpdate({_id : _id, user : user_id}, obj, {new : true}).exec()

        if(result)
            return success(res, result)
        
        return error(res, message.SET_QUESTION_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent xóa bộ câu hỏi
router.delete('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let _id = req.body._id
        let user_id = req.user._id

        //check param
        if (validateParameters([_id], res) == false) 
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

//Agent đổi trạng thái
router.put('/status', verifyTokenAdmin, async(req, res) => {
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

router.get('/check', verifyTokenAgent, async(req, res) => {
    try
    {
        let user_id = req.user._id
        let stream = req.query.stream
        //let dateNow = moment().format('YYYY-MM-DD')
        let dateNow = moment().add(11, 'h').format('YYYY-MM-DD')
        //let dateTomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
        let dateTomorrow = moment().add(11, 'h').add(1, 'd').format('YYYY-MM-DD')
        let timeNow =  moment(moment().add(11, 'h'), 'HH:mm:ss')
        //let timeNow = moment(moment(), 'HH:mm:ss')

        console.log(dateNow)
        console.log(dateTomorrow)
        console.log(timeNow)

        let result = await userRequestsModel.findOne({user : user_id, date :  { $gte: dateNow, $lte: dateTomorrow}, $or : [{status : STATUS_USER_REQUEST.ACTIVED}, {status : STATUS_USER_REQUEST.PLAYED}]}).populate('gift').exec()
        let check = false
        if(result)
        {
            console.log(result)
            for (let i = 0; i < LIVESTREAM_TIME_ENUM.length; i++) {
                if(result.time == LIVESTREAM_TIME_ENUM[i].id)
                {
                    let timeBefore30 = moment(LIVESTREAM_TIME_ENUM[i].from, 'HH:mm:ss').add(-30, 'minutes')
                    let timeTo = moment(LIVESTREAM_TIME_ENUM[i].to, 'HH:mm:ss')

                    console.log(timeNow.isAfter(timeBefore30))
                    console.log(timeNow.isBefore(timeTo))
                    console.log(timeTo)

                    if(timeNow.isAfter(timeBefore30) && timeNow.isBefore(timeTo))
                        check = true
                }
            }
        }

        if(stream)
            await userRequestsModel.findOneAndUpdate({user : user_id, date :  { $gte: dateNow, $lte: dateTomorrow}, status : STATUS_USER_REQUEST.ACTIVED}, {status : STATUS_USER_REQUEST.PLAYED}).exec()

        return check ? success(res, result) : error(res, message.NOT_EXIST_TIME)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

router.get('/checkWhoLive', verifyToken, async(req, res) => {
    try
    {
        //let dateNow = moment().format('YYYY-MM-DD')
        let dateNow = moment().add(11, 'h').format('YYYY-MM-DD')
        //let dateTomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
        let dateTomorrow = moment().add(11, 'h').add(1, 'd').format('YYYY-MM-DD')
        let timeNow = moment(moment().add(11, 'h'), 'HH:mm:ss')
        //let timeNow = moment(moment(), 'HH:mm:ss')

        let result = await userRequestsModel.findOne({date :  { $gte: dateNow, $lte: dateTomorrow}, $or : [{status : STATUS_USER_REQUEST.ACTIVED}, {status : STATUS_USER_REQUEST.PLAYED}]}).populate('gift').populate({ path: 'user', select: '-password' }).exec()
        let check = false

        if(result)
        {
            for (let i = 0; i < LIVESTREAM_TIME_ENUM.length; i++) {
                if(result.time == LIVESTREAM_TIME_ENUM[i].id)
                {
                    let timeBefore30 = moment(LIVESTREAM_TIME_ENUM[i].from, 'HH:mm:ss').add(-30, 'minutes')
                    let timeTo = moment(LIVESTREAM_TIME_ENUM[i].to, 'HH:mm:ss')
                    if(timeNow.isAfter(timeBefore30) && timeNow.isBefore(timeTo))
                        check = true
                }
            }
        }

        return check ? success(res, result) : error(res, message.NOT_EXIST_TIME)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

router.get('/winner', verifyTokenAgent, async(req, res) => {
    try
    {
        let user_request = req.query.user_request
 
        //check param
        if (validateParameters([user_request], res) == false) 
            return

        let userRequest = await userRequestsModel.findById(user_request).populate('gift').exec()
        //check xem đã kết thúc chưa
        //Nếu chưa thì xử lý phát thưởng
        if(!userRequest.end)
        { 
            //Lấy ra top win cao điểm nhất mà lớn hơn 0 điểm
            let listWin = await userHistoryModel.find({user_request : userRequest._id}).sort({score : 1}).limit(userRequest.top_win).exec()

            for (let i = 0; i < listWin.length; i++) {
                await userHistoryModel.findByIdAndUpdate(listWin[i]._id, {gift : userRequest.gift}).exec()
            }

            await userRequestsModel.findByIdAndUpdate(user_request, {end : true}).exec()
        }
       
        let listTopWin = await userHistoryModel.find({user_request : userRequest._id}).sort({score : 1}).limit(userRequest.top_win).populate({ path: 'user', select: '-password' }).exec()

        for (let i = 0; i < listTopWin.length; i++) {
            listTopWin[i].user.avatar = listTopWin[i].user.avatar ? config.BASE_URL + '/uploads/' + listTopWin[i].user.avatar : config.NO_IMAGE
        }

        return success(res, listTopWin)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

module.exports = router