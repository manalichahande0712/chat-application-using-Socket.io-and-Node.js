const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const Cryptr = require("cryptr");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const formatMessage = require('./helpers/formatDate');
const cryptr = new Cryptr(
  "mySecretKey"
);
const messageModel = require('./models/messages');
const cookieParser = require("cookie-parser");

const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers,
  getMessage,
  saveMessage
} = require('./helpers/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
require('dotenv').config()

// var Chat = mongoose.model('Message', chatSchema);
mongoose.connect('mongodb://localhost:27017/Chat_application', {useNewUrlParser: true}, (err) => {
if (!err) {console.log('MongoDB Connection Succeeded.') }
else {console.log('Error in DB connection:' + err) }
});

//set static folder
app.use(express.static('.'));


// Set the view engine  
app.set("view engine", "hbs");


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors({ origin: '*' }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render('index')
});

app.use("/register",registerRoute);
app.use("/login",loginRoute);


io.on('connection', socket => {
//   Chat.find({}, function (err, docs) {
//     if (err) throw err;
//     socket.emit('load old msgs', docs);
// })
  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

    // General welcome
    socket.emit('message', formatMessage("Admin", cryptr.encrypt ("Welcome to chat room! ")));
    
    // Broadcast everytime users connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("Admin", cryptr.encrypt(`${user.username} has joined the room`))
      );

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });

  });

  // socket.on('load old msgs', function (docs) {
  //   for(var i=0; i<docs.length; i++){
  //       displayMsg(docs[i]);
  //  }
  // })

  
  // Listen for client message
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);
    const status = getMessage(socket.id);
    const m = saveMessage(msg, user)
    io.to(user.room).emit('message', formatMessage(user.username, msg), status);
  });
  

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("Admin", cryptr.encrypt`${user.username} has left the room`)
      );

      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });

});


// ROUTES
app.get("/decrypt", async (req, res) => {   
  message = req.query.message;
  console.log("LD: " + message.length);
  decrypted = cryptr.decrypt(message);
  await res.json(decrypted);
});

app.get("/encrypt", async (req, res) => {
  message = req.query.message;
  encrypted = cryptr.encrypt(message);
  console.log("LE: " + encrypted.length);
  await res.json(encrypted);
});



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));