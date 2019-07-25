const express = require('express')
const router = express.Router()
const config = require('../../utils/config')
const message = require('../../utils/message')
const userHistoriesModel = require('../userHistories/userHistoriesModel')
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

//Lấy danh sách lịch sử chơi game
router.get('/', verifyToken, async(req, res) => {
    try
    {
        let user_id = req.user.user_id
        let set_question = req.query.set_question || ''
        let page = req.query.page || 0
        let limit = req.query.limit || 20

        if(req.user.role == ROLE_USER.ADMIN)
            user_id = req.query.user_id

        let query   = {
            $and : [
                (set_question != '') ? {set_question : set_question} : {},
                {user : user_id}
            ]
        }
        
        let options = {
            sort:     { updatedAt: 1 },
            lean :   true,
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

module.exports = router
