const express = require('express')
const router = express.Router()
const {
    error,
    success,
    verifyToken
} = require('../../utils/utils')

const {LIVESTREAM_TIME_ENUM} = require('../../utils/enum')

//Lấy danh sách lịch sử chơi game
router.get('/', verifyToken, async(req, res) => {
    try
    {
        return success(res, LIVESTREAM_TIME_ENUM)
    }
    catch(e)
    {
        return error(res, e)
    }
})

module.exports = router
