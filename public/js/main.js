const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const RoomForm = document.getElementById('roomForm');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log({username, room});

const socket = io();
RoomForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const room = e.target.elements.roomName.value;
  console.log('Room :', room)
    url = 'http://localhost:3000/login/verify'
    fetch(url)
    .then((res) => res.json())
    .then((username) => {
      socket.emit('joinRoom', { username, room })
    })
    .catch(rejected => {
      console.log(rejected)
    })
    e.target.elements.roomName.value = '';
});


// Join chatroom
// socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message, status) => {
  // myMsg = 'delivered'
   console.log(message );
  //outputMessage(message, status);
  url = "http://localhost:3000/decrypt?message=" + message.text;
  console.log("URL : " + url);
  fetch(url)
    .then((res) => res.json())
    .then((decrypted) => {
      console.log("DECRYPTED ", decrypted);
      outputMessage({
          username: message.username,
        text: decrypted,
        time: message.time,
        date: message.date 
      }, status);
    });

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;

});



// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  //msg = msg.trim();

 // if (!msg) {
   // return false;
 // }

  // Emit message to server
  url = "http://localhost:3000/encrypt?message=" + msg;
  fetch(url)
    .then((res) => res.json())
    .then((encrypted) => {
  socket.emit('chatMessage', encrypted);
});

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message, status) {
  if (status === undefined){
    status = ""
  }
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  p.innerHTML += `<span style="margin-left: -490px;">${message.date}</span>`;
  // p.innerHTML += `<span>${status}</span>`;
  // p.innerHTML += `<span>${myMsg}</span>`;
 
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
  para.innerHTML += `<span style="margin-left: 600px; color:green;">${status}</span>`;
 
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
 console.log({users})
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});