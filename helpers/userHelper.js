const users = [];
// const messages = require('./models/messages.js');
// const User = require('../models/user.js');
const  MessageModel = require('../models/messages.js');

// Join user to chat
function newUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getActiveUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function exitRoom(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getIndividualRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function saveMessage(msg, user){
  let message = new MessageModel({
    sender: user.username,
    message: msg,
    time:msg.time,
  })
  m = message.save();
}  

function getMessage(id){
  const index = users.length
  let status;
  if(index === 1){
    return status = 'sent'
  } else if (index > 1 ){
       
    return status = 'delivered'
  } else {
      return status = index
  }
}

// Message.find({}, function (err, docs) {
//   if (err) throw err;
//   socket.emit('load old msgs', docs);
// })

module.exports = {
  newUser,
  getActiveUser,
  exitRoom,
  getIndividualRoomUsers,
  getMessage,
  saveMessage
};