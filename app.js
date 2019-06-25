const express = require('express')
const bodyParser = require('body-parser')
const Pusher = require('pusher')
const app = express()


// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Session middleware

// Create an instance of Pusher
const pusher = new Pusher({
    appId: '810804',
    key: 'f70f1870659a69d4de88',
    secret: '4f09e3455f0386b4eac7',
    cluster: 'ap1',
    encrypted: true
  })

// get authentictation for the channel;
app.post("/pusher/auth", (req, res) => {
const socketId = req.body.socket_id
const channel = req.body.channel_name
var presenceData = {
    user_id:
    Math.random()
        .toString(36)
        .slice(2) + Date.now()
};
const auth = pusher.authenticate(socketId, channel, presenceData)
res.send(auth)
})

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/index.html')
})

//listen on the app
app.listen(3000, () => {
    return console.log('Server is up on 3000')
})