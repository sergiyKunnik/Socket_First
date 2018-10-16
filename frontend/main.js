$(document).ready(function() {
    const socket = io.connect('http://localhost:5000');
    const form = $('#myForm');
    const txt = $('#txt');
    const chatArea = $('#chatArea');

    form.submit(function(e) {
        e.preventDefault();
        socket.emit('sending message', txt.val());
        txt.val('');
    });
    socket.on('new message', function(data){
        chatArea.append('<div class="well">'+data.message+'</div>');
    });

});