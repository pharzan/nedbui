
var dbService=require('./dbService.js').init({path:'data/test00.db'});
var server = require('http').createServer();
var io = require('socket.io').listen(server);


server.listen(8000);
dbService.load();
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('command',function(data){
	console.log('from Client',data)
    })
});



setInterval(function(){    
    io.emit('data',{a:'hello'});
},1000);

