$(document).ready(function () {
  const chatArea = $('#chatArea');
  const main = $('#main');
  const signIn = $('#signIn');

  const writeMessage = (message) => {
    const user = JSON.parse(localStorage.getItem('info'));
    if (message.user._id.toString() === user._id.toString()) {
      chatArea.append(`<div class="well" style="display: flex; justify-content: space-between; background-color: greenyellow;">
          <div>${message.text}</div>
          <img style="width: 50px; height: 50px; border-radius: 50%;" src="${message.user.photo}" alt="">
        </div>`);
    } else {
      chatArea.append(`<div class="well" style="display: flex; justify-content: space-between; background-color: greenyellow;">
          <img style="width: 50px; height: 50px; border-radius: 50%;" src="${message.user.photo}" alt="">
          <div>${message.text}</div>
        </div>`);
    }
  }
  const socket = io.connect('http://localhost:5000');
  const form = $('#myForm');
  const signInForm = $('#signInForm');
  const txt = $('#txt');
  const number = $('#phoneNumber');

  const token = localStorage.getItem('token');
  // socket.emit('restore-db');
// 
  socket.emit('info', token);
  socket.on('your-info', function (data) {
    console.log('your-info => ')
    localStorage.setItem('info', JSON.stringify(data));
    socket.emit('get-messages');

    console.log('інформація про тебе => ', data);
  });

  socket.on('person-info', function (data) {
    console.log('інформація про співрозмовника => ', data);
  });

  socket.on('messages', function (messages) {
    console.log('messages => ', messages)
    for (const message of messages) {

      writeMessage(message);
    }
  });

  socket.on('token', function (token) {
    console.log('get token => ', token)
    localStorage.setItem('token', token);
    socket.emit('info', token);
  });

  socket.on('numbers', function (data) {
    console.log('numbers => ', data)
  });



  form.submit(function (e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    socket.emit('sending message', {token, text: txt.val()});
    txt.val('');
  });

  signInForm.submit(function (e) {
    e.preventDefault();
    socket.emit('sign-in', number.val());
    signIn.addClass('hide');
    main.removeClass('hide');
    number.val('');
  });

  socket.on('new message', function (data) {
    writeMessage(data)
  });

  socket.on('fail', () => {
    console.log('fail => |||')
    main.addClass('hide');
    signIn.removeClass('hide');
    console.log('get-numbers')
    socket.emit('get-numbers');
    number.val('');
  });
})