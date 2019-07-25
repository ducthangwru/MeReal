const express = require('express')
const router = express.Router()
const {
    error,
    success,
    verifyToken,
    verifyTokenAdmin,
    verifyTokenAgent,
    verifyTokenAgentOrAdmin
} = require('../../utils/utils')

router.get('/', verifyToken, async(req, res) => {
    try
    {

    }
    catch(e)
    {
        return error(res, e)
    }
})

module.exports = router