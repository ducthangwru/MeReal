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

// HTTP stuff
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './index.html')));

mongoose.connect(process.env.CONNECT_MONGO, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connect to db success');
    }
})

//listen on the app
server.listen(PORT, () => {
    return console.log(`Server is up on ${PORT}`)
})