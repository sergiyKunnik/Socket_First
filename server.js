const http = require('http');
const app = require('./app')
const port = 5000;
const server = http.createServer(app);
const io = require('socket.io')(server);
const UserService = require('./user/user.service');
const MessageService = require('./message/message.service');
const jwt = require('jsonwebtoken');
const mocks = require('./mocks');

const restoreDb = async () => {
  await UserService.deleteAll();
  await MessageService.deleteAll();
  for (const user of mocks.users) {
    await UserService.create(user.number, user.name, user.photo);
  }
}


io.sockets.on('connection', (socket) => {

  const getUserByToken = async (token) => {
    try {
      return jwt.verify(token, 'test');
    } catch (error) {
      console.log('fail => |')
      io.sockets.emit('fail');
    }
  }
  socket.on('restore-db', async () => {
    await restoreDb();

  });

  socket.on('info', async (token) => {
    console.log('info')
    const userData = await getUserByToken(token);
    if (userData) {
      const user = await UserService.getById(userData.userId);
      if (user) {
        console.log('socket.id => ', socket.id)
        io.to(socket.id).emit('your-info', user);
        const person = await UserService.getPerson(user.number);

        io.to(socket.id).emit('person-info', person);
      } else {
        io.to(socket.id).emit('fail');
        console.log('fail => ||')
      }
    } else {
      console.log('faile')
      io.to(socket.id).emit('fail');
    }
  });

  socket.on('get-numbers', async () => {
    const numbers = await UserService.getNumbers();
    // console.log('numbers => ', numbers)
    io.to(socket.id).emit('numbers', numbers);
  });

  socket.on('get-messages', async () => {
    const messages = await MessageService.getAll();
    io.to(socket.id).emit('messages', messages);
  });


  socket.on('sign-in', async (number) => {
    const response = await UserService.signIn(number);
    if (response.token) {
      io.to(socket.id).emit('token', response.token);
    } else {
      socket.to(socket.id).emit('fail');
    }
  });



  // socket.on('disconnect', () => {
  //     connections.splice(connections.indexOf(socket), 1);
  // });


  socket.on('sending message', async (data) => {


    const user = await getUserByToken(data.token);
    if (user) {
      const message = await MessageService.create(data.text, user.userId);
      io.sockets.emit('new message', message);
    }
  });
});






server.listen(port, '0.0.0.0', async () => {
  await restoreDb();
});