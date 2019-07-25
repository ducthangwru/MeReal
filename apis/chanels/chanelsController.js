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

module.exports = router