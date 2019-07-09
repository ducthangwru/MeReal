const JWT = require('jsonwebtoken')
const message = require('./message')

const verifyToken = async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (typeof token !== "undefined") {
        req.token = token
        req.user = await verifyAccessToken(token)
        req.user ? next() : error(req, res, message.INVALID_TOKEN)
    } else {
        error(req, res, message.INVALID_TOKEN)
    }
}

const assignToken = (user_id, username, email) => {
    return new Promise((resolve, reject) => {
        JWT.sign({username: username, user_id: user_id, email: email}, process.env.SECRET_KEY, (e, token) => {
            if (e) reject(e)
            else resolve(token)
        })
    })
}

const verify = async(token) => {
    try {
        var ret = await Promise.all([checkToken(token), verifyAccessToken(token)])
        return Promise.resolve(ret[1])
    } catch (e) {
        return Promise.reject(e)
    }
}

const verifyAccessToken = async (token) => {
    try
    {
        return await JWT.verify(token, process.env.SECRET_KEY)
    }
    catch(e)
    {
        return null
    }
    
}

const error = function (res, error) {
    res.send({success: false, error: error})
}

const success = function (res, data, page) {
    var obj = {success: true}
    obj.data = data
    if(data && typeof data.page !== 'undefined' && data.page >= 0) {
        data.next_page = parseInt(data.page) + 1
        data.PAGE_SIZE = config.PAGE_SIZE
    }

    else if(data && typeof page != 'undefined') {
        obj.next_page = parseInt(page) + 1
        obj.PAGE_SIZE = config.PAGE_SIZE
    }

    if(data && typeof data.total_data != 'undefined')
    {
        obj.total_data = data.total_data
        delete data.total_data
    }

    res.status(200)
    res.send(obj)
}

module.exports = {
    verifyToken,
    verify,
    assignToken,
    verifyAccessToken,
    error,
    success
}