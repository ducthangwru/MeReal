require('dotenv').config()
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const WebSocket = require('ws');
const app = express();
var server = require('http').createServer(app);
const wsServer = new WebSocket.Server({ server: server }, () => console.log(`WS server is listening at ws://localhost:${process.env.PORT}`));

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

let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    // add new connected client
    connectedClients.push(ws);
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter
    ws.on('message', data => {
        // send the base64 encoded frame to each connected ws
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                ws.send(data); // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
            }
        });
    });
});

// HTTP stuff
app.get('/client', (req, res) => res.sendFile(path.resolve(__dirname, './client.html')));
app.get('/streamer', (req, res) => res.sendFile(path.resolve(__dirname, './streamer.html')));
app.get('/', (req, res) => {
    res.send(`
        <a href="streamer">Streamer</a><br>
        <a href="client">Client</a>
    `);
});

mongoose.connect(process.env.CONNECT_MONGO, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connect to db success');
    }
})

//listen on the app
server.listen(process.env.PORT, () => {
    return console.log(`Server is up on ${process.env.PORT}`)
})