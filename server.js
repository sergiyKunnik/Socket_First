const http = require('http');
const app = require('./app')
const port = 5000;
const server = http.createServer(app);
const io = require('socket.io')(server);



io.sockets.on('connection', (socket) => {
    // socket.on('disconnect', () => {
    //     connections.splice(connections.indexOf(socket), 1);
    // });

    socket.on('sending message', (message) => {  
        io.sockets.emit('new message', {message: message});
    });
});






server.listen(port);