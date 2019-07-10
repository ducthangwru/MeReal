require('dotenv').config()
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const PORT = process.env.PORT || 3000
const app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
const CONNECT_MONGO = 'mongodb://localhost/mereal'

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Session middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')))

// signaling
io.on('connection', function (socket) {
    console.log('a user connected')

    socket.on('create or join', function (room) {
        console.log('create or join to room ', room);
        
        var myRoom = io.sockets.adapter.rooms[room] || { length: 0 }
        var numClients = myRoom.length;

        console.log(room, ' has ', numClients, ' clients')

        if (numClients == 0) {
            socket.join(room)
            socket.emit('created', room)
        } else if (numClients == 1) {
            socket.join(room);
            socket.emit('joined', room)
        } else {
            socket.emit('full', room)
        }
    })

    socket.on('joinroom', function (room) {
        var myRoom = io.sockets.adapter.rooms[room] || { length: 0 }
        var numClients = myRoom.length;

        if (numClients == 0) {
            socket.join(room)
            socket.emit('created', room)
        } else if (numClients >= 1) {
            socket.join(room);
            socket.emit('joined', {room : room, id : socket.id})
        }
    })

    socket.on('ready', function (room){
        socket.broadcast.to(room).emit('ready')
    })

    socket.on('candidate', function (event){
        socket.broadcast.to(event.room).emit('candidate', event)
    })

    socket.on('offer', function(event){
        socket.broadcast.to(event.room).emit('offer',event.sdp)
    })

    socket.on('answer', function(event){
        socket.broadcast.to(event.room).emit('answer',event.sdp)
    });
});

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/index.html')
})

app.get('/videocall', (req, res) => {
    return res.sendFile(__dirname + '/videocall.html')
})


const public = require('./apis/public/publicController')

app.use('/public', public)

mongoose.set('useFindAndModify', false)
mongoose.connect(CONNECT_MONGO, (e) => {
    if (e) {
      console.log(e);
    } else {
      console.log('Connect to db success')
    }
})

//listen on the app
server.listen(PORT, () => {
    return console.log(`Server is up on ${PORT}`)
})