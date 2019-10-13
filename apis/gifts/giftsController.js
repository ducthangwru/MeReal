const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const giftModel = require('./giftsModel')
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

const {STATUS_GIFT, TYPE_GIFT} = require('../../utils/enum')

//Lấy danh sách quà tặng, thưởng
router.get('/', verifyToken, async(req, res) => {
    try
    {
        let search = req.query.search || ''
        let page = req.query.page || 0
        let limit = req.query.limit || 1000

        let query   = {
            $and : [
                (search != '') ? {name : {$regex: search, $options: "i"}} : {}
            ]
        }
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
            offset:   parseInt(limit) * parseInt(page), 
            limit:    parseInt(limit)
        }

        let result = await giftModel.paginate(query, options)

        for (let i = 0; i < result.docs.length; i++) {
            result.docs[i].image = result.docs[i].image ? config.BASE_URL + '/uploads/' + result.docs[i].image : config.NO_IMAGE
        }

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent thêm quà tặng, thưởng
router.post('/', verifyTokenAgent, async(req, res) => {
    try
    {
        await upObject(req, res)

        let obj = {
            name : req.body.name,
            desc : req.body.desc,
            type : req.body.type,
            price : req.body.price,
            status : req.body.status,
            user : req.user._id,
            image : req.files['image'][0].filename || null
        }

         //check param
        if (validateParameters([
                obj.name, 
                obj.desc,
                obj.type,
                obj.price,
                obj.status
            ], res) == false) 
            return

        let result = await giftModel.create(obj)

        return success(res, result)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent sửa quà tặng, thưởng
router.put('/', verifyTokenAgent, async(req, res) => {
    try
    {
        await upObject(req, res)

        let obj = {
            _id : req.body._id,
            name : req.body.name,
            desc : req.body.desc,
            type : req.body.type,
            price : req.body.price,
            status : req.body.status,
            image : req.files['image'][0].filename || null
        }

         //check param
        if (validateParameters([
                obj._id, 
                obj.name, 
                obj.desc,
                obj.type,
                obj.price,
                obj.status
            ], res) == false) 
            return

        let result = await giftModel.findByIdAndUpdate(obj._id, obj, {new : true}).exec()

        if(result)
            return success(res, result)
        
        return error(res, message.GIFT_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

//Agent xóa câu hỏi
router.delete('/', verifyTokenAgent, async(req, res) => {
    try
    {
        let _id = req.body._id

        //check param
        if (validateParameters([_id], res) == false) 
            return

        let result = await giftModel.findByIdAndUpdate(_id, {status : STATUS_GIFT.DELETE}, {new : true}).exec()

        if(result)
            return success(res, result)
        
        return error(res, message.GIFT_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

router.put('/status', verifyTokenAdmin, async(req, res) => {
    try
    {
        let _id = req.body._id
        let status = req.body.status

        //check param
        if (validateParameters([_id, status], res) == false) 
            return

        if(await giftModel.findById(_id).exec())
        {
            await giftModel.findByIdAndUpdate(_id, {status}).exec()
            return success(res)
        }
        
        return error(res, message.GIFT_NOT_EXISTS)
    }
    catch(e)
    {
        return error(res, e.message)
    }
})

module.exports = router