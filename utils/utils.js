const JWT = require('jsonwebtoken')
const message = require('./message')
const crypto = require('crypto')
const config = require('./config')
const nodemailer = require('nodemailer')
const {ROLE_USER} = require('./enum')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: config.USER_EMAIL,
           pass: config.PASS_EMAIL
       }
   });

const verifyToken = async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (typeof token !== "undefined") {
        req.token = token
        req.user = await verifyAccessToken(token)
        req.user ? next() : error(res, message.INVALID_TOKEN)
    } else {
        return error(res, message.INVALID_TOKEN)
    }
}

const verifyTokenAdmin = async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (typeof token !== "undefined") {
        req.token = token
        req.user = await verifyAccessToken(token)
        if(req.user && req.user.role == ROLE_USER.ADMIN) 
            return next() 

        return error(res, message.INVALID_TOKEN)
    } else {
        return error(res, message.INVALID_TOKEN)
    }
}

const verifyTokenAgent = async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (typeof token !== "undefined") {
        req.token = token
        req.user = await verifyAccessToken(token)
        if(req.user && req.user.role == ROLE_USER.AGENT) 
            return next() 
            
        return error(res, message.INVALID_TOKEN)
    } else {
        return error(res, message.INVALID_TOKEN)
    }
}

const verifyTokenAgentOrAdmin = async (req, res, next) => {
    var token = req.headers['x-access-token']
    if (typeof token !== "undefined") {
        req.token = token
        req.user = await verifyAccessToken(token)
        if(req.user && req.user.role != ROLE_USER.USER) 
            return next() 
        
        return error(res, message.INVALID_TOKEN)
    } else {
        return error(res, message.INVALID_TOKEN)
    }
}

const assignToken = (user_id, username, email, role) => {
    return new Promise((resolve, reject) => {
        JWT.sign({username: username, _id: user_id, email: email, role : role}, config.SECRET_KEY, (e, token) => {
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
        return await JWT.verify(token, config.SECRET_KEY)
    }
    catch(e)
    {
        return null
    }
    
}

const error = function (res, error) {
    return res.send({success: false, error: error})
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
    return res.send(obj)
}


const checkRegexUsername = function(username) {
    let usernameRegex = /^[a-zA-Z\d.]{5,20}$/
    return username.match(usernameRegex)
}

const checkRegexPassword = function(password) {
    let passwordRegex = /([A-Za-z\d\@\!\#\$\%\^\&\*\(\)]){8,}/
    return password.match(passwordRegex)
}

const md5 = function (plain) {
    return crypto.createHash('md5').update(plain).digest('hex')
}

const validateParameters = function (args, res) {
    for (var i = 0; i < args.length; i++) {
        var arg = args[i]
        if (!arg) {
            res.send({success: false, error: 'Missing required parameters'})
            return false
        }
    }
    return true
}

const sendEmail = async function(to, subject, content) {
    try
    {
        var mailOptions = {
            from: `"[MeReal]" <info@mereal.findme.vn>`,
            to: to,
            subject: subject,
            html: content
        }
    
        return await transporter.sendMail(mailOptions)
    }
    catch(e)
    {
        return e.message
    }
}

const sendEmailForgotPW = async function(email, code) {
    return await sendEmail(email, '[MeReal] Đặt lại mật khẩu', 
                config.form_email(
                        '[MeReal] Đặt lại mật khẩu',
                        'Nhập mã để đặt lại mật khẩu hoặc chỉ cần nhấp vào Đặt lại mật khẩu.',
                        'Mã đặt lại mật khẩu:',
                        'Đặt lại mật khẩu',
                        'Bạn có thể sao chép liên kết đặt lại mật khẩu',
                        code, 
                        `${config.BASE_URL}/resetPassword?email=${email}&code=${code}`))
}

module.exports = {
    verifyToken,
    verifyTokenAdmin,
    verifyTokenAgent,
    verifyTokenAgentOrAdmin,
    verify,
    assignToken,
    verifyAccessToken,
    error,
    success,
    checkRegexUsername,
    checkRegexPassword,
    md5,
    validateParameters,
    sendEmailForgotPW
}