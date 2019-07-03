require('dotenv').config()
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const Pusher = require('pusher');
const PORT = process.env.PORT || 3000
const app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
const CONNECT_MONGO = 'mongodb://localhost/mereal'
// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Session middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

// const publicController = require('./api/PublicController')
// const usersController = require('./api/UsersController')

// app.use('/api', publicController);
// app.use('/api/user', usersController);

// Create an instance of Pusher
const pusher = new Pusher({
  appId: '810804',
  key: 'f70f1870659a69d4de88',
  secret: '4f09e3455f0386b4eac7',
  cluster: 'ap1',
  encrypted: true
})

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/index.html')
})

// get authentictation for the channel;
app.post('/pusher/auth', (req, res) => {
      const socketId = req.body.socket_id;
      const channel = req.body.channel_name;
      var presenceData = {
          user_id: Math.random().toString(36).slice(2) + Date.now()
      }
      const auth = pusher.authenticate(socketId, channel, presenceData)
      res.send(auth)
})

mongoose.connect(CONNECT_MONGO, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connect to db success')
    }
})

//listen on the app
server.listen(PORT, () => {
    return console.log(`Server is up on ${PORT}`)
})