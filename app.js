require('dotenv').config()
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const moment = require('moment')
const session = require('express-session')
const utils = require('./utils/utils')
const userModel = require('./apis/users/usersModel')
const {ROLE_USER} = require('./utils/enum')
const PORT = process.env.PORT || 3000
const app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
const socket = require('./apis/chat/socket')
const fs = require('fs')
socket.createSocket(io)

const CONNECT_MONGO = 'mongodb://admin:admin123@ds243317.mlab.com:43317/mereal'

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Session middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))

app.use(session({
    secret: '@MeReal&',
    resave: false,
    saveUninitialized: true,
    cookie: {expires: moment().add(1, 'days'), maxAge: 1 * 24 * 60 * 60 * 1000},
    name: "MeReal"
}));

app.use(function (req, res, next) {
    req.headers['if-none-match'] = '';
    req.headers['if-modified-since'] = '';
    if (!req.session.token && req.url !== '/'
        && !req.url.includes('/login') 
        && req.url.includes('/uploads') 
        && !req.url.includes('/register') 
        && !req.url.includes('/forgot') 
        && !req.url.includes('/resetPassword') 
        && req.url.indexOf(".") === -1 
        && req.url.indexOf("/api/") === -1) {
        res.redirect('/login')
    } else {
        next()
    }
})

const public = require('./apis/public/publicController')
const user = require('./apis/users/usersController')
const question = require('./apis/questions/questionsController')
const gift = require('./apis/gifts/giftsController')
const answer = require('./apis/answers/answersController')
const userRequest = require('./apis/userRequests/userRequestsController')
const userHistory = require('./apis/userHistories/userHistoriesController')
const time = require('./apis/times/timesController')

app.use('/api/public', public)
app.use('/api/user', user)
app.use('/api/question', question)
app.use('/api/gift', gift)
app.use('/api/answer', answer)
app.use('/api/userRequest', userRequest)
app.use('/api/userHistory', userHistory)
app.use('/api/time', time)

app.get('/', async (req, res, next) => {
    if(req.session.token)
    {
        let user = await utils.verifyAccessToken(req.session.token)
        user = await userModel.findById(user._id).exec()
        res.render('home', {user : user})
    }
    else
        res.redirect('/login')
})

app.get('/logout', function (req, res, next) {
    req.session.token = null
    res.redirect('/login')
})

app.get('/login', function (req, res, next) {
    if(req.session.token)
    {
        res.redirect('/')
    }
    else
        res.render('login', {layout: false})
})

app.get('/register', function (req, res, next) {
    if(req.session.token)
    {
        res.redirect('/')
    }
    else
        res.render('register', {layout: false})
})

app.get('/forgot', function (req, res, next) {
    if(req.session.token)
    {
        res.redirect('/')
    }
    else
        res.render('forgot', {layout: false})
})

app.get('/resetPassword', function (req, res, next) {
    res.render('resetPassword', {layout: false})
})

app.get('/profile', function (req, res, next) {
    res.render('profile')
})

app.get('/question', function (req, res, next) {
    res.render('question')
})

app.get('/gift', function (req, res, next) {
    res.render('gift')
})

app.get('/request', function (req, res, next) {
    res.render('request')
})

app.get('/user', function (req, res, next) {
    res.render('user')
})

app.get('/history', function (req, res, next) {
    res.render('history')
})

app.get('/time', function (req, res, next) {
    res.render('time')
})

app.get('/privacy_policy_of_xeminh.html', function (req, res, next) {
    res.render('privacy', {layout : false})
})

app.get('/uploads/:file', function (req, res, next) {
    let file = req.params.file
    if(fs.existsSync(path.resolve(`uploads/${file}`)))
        res.sendFile(path.resolve(`uploads/${file}`)) 
    else
        res.send({error : "no such file"})
});


app.get('/404', function (req, res, next) {
    res.render('404', {layout : false});
})

app.use(function(req, res){ 
    res.redirect("/404") 
})

mongoose.set('useFindAndModify', false)
mongoose.connect(CONNECT_MONGO, { autoIndex: true }, (e) => {
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