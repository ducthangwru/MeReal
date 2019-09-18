const config = require('../../utils/config')
const userModel = require('../users/usersModel')
const moment = require('moment')
const {verifyAccessToken} = require('../../utils/utils')

const createSocket = (io) => {
    try
    {
        io.use(async (socket, next) => {
            try {
                let token = socket.request._query['token']
                let user = await verifyAccessToken(token)

                if (!user || !userModel.findById(user._id).exec()) {
                    io.to(socket.id).emit('connect_failed', false)
                }

                socket.user = user
                socket.join(config.SECRET_KEY)
                io.to(socket.id).emit('connect_success', true)
                socket.broadcast.to(config.SECRET_KEY).emit('joined', user)
                next()

            } catch (e) {
                console.log(e)
            }
        })

        io.on('connection', (socket) => {
            try
            {
                socket.on('send', (data) => {
                    try
                    {
                        if(data.msg)
                            socket.broadcast.to(config.SECRET_KEY).emit('received', {user : socket.user, data : data})
                    }
                    catch(e)
                    {
                        log.error(e)
                    }
                })

                socket.on('start1', (data) => {
                    try
                    {
                        socket.broadcast.to(config.SECRET_KEY).emit('start1', data)
                    }
                    catch(e)
                    {
                        log.error(e)
                    }
                })

                socket.on('contentQuestion', (data) => {
                    try
                    {
                        socket.broadcast.to(config.SECRET_KEY).emit('contentQuestion', data)
                    }
                    catch(e)
                    {
                        log.error(e)
                    }
                })

                socket.on('contentAnswer', (data) => {
                    try
                    {
                        socket.broadcast.to(config.SECRET_KEY).emit('contentAnswer', data)
                    }
                    catch(e)
                    {
                        log.error(e)
                    }
                })
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
    catch(e)
    {
        console.log(e)
    }
}

module.exports = {
    createSocket
}