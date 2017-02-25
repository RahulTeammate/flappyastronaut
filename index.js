var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');

//Phaser cannot run on the server since document doesn't exist.
//Server Rooms
var rooms = []
var roomMaxLength = 50;
for (var i = 0; i < roomMaxLength; i++) {
	rooms.push([null,null]);
}

//app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname));

app.get('/', function(req, res, next){
  res.sendfile(path.join(__dirname,'index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');
  /*
   * emits come befoe ons.
   */
  //emit a signal to make the server introduce itself to the client.
  socket.emit('message',{msg : 'Hello from server'});
  
  //if the client sends a waiting4player signal to the server
  socket.on('message', function (data) {
		if (data.msg && data.msg == 'rand wall') {
			var oppoPlayer = (data.player == 0) ? 1 : 0;
			console.log(oppoPlayer);
			console.log('server sends opponent the random wall');
			if (rooms[data.room][oppoPlayer] != null) {//done for sudden disconnects
				(rooms[data.room][oppoPlayer]).emit('message', {msg:'rand wall', randWall: data.rand});
			}
		}
		else if (data.msg && data.msg == 'tracking x y') {
			var oppoPlayer = (data.player == 0) ? 1 : 0;
			console.log(oppoPlayer);
			console.log('server sends opponent position');
			if (rooms[data.room][oppoPlayer] != null) {//done for sudden disconnects
				(rooms[data.room][oppoPlayer]).emit('message', {msg:'opponent position', x:data.x, y:data.y});
			}
		}
		else if (data.msg && data.msg == 'opponent lost') {
			var oppoPlayer = (data.player == 0) ? 1 : 0;
			console.log(oppoPlayer);
			console.log('server sends you win signal');
			if (rooms[data.room][oppoPlayer] != null) {//done for sudden disconnects
				(rooms[data.room][oppoPlayer]).emit('message', {msg:'you win'});
			}
		}
		else if (data.msg && data.msg == 'Hello from client') {
			for (var i = 0; i < roomMaxLength; i++) {
				if (rooms[i][0] == null) {
					rooms[i][0] = socket;
					if (rooms[i][1] == null) { //game cannot start
						console.log('Client must wait. NOOOOOOOOOOO.');
						if (rooms[i][0] != null) { //done for sudden disconnects
							(rooms[i][0]).emit('message',{msg: 'Game cannot start', roomIndex: i, playerIndex: 0});
						}
					}
					else { //game start
						console.log('Two clients start the game. YAAAAAAAAAAAAY');
						if (rooms[i][0] != null && rooms[i][1] != null) {//done for sudden disconnects
							(rooms[i][0]).emit('message',{msg: 'Game start', roomIndex: i, playerIndex: 0});
							(rooms[i][1]).emit('message',{msg: 'Game start', roomIndex: i, playerIndex: 1});
						}
					}
					break;
				}
				else if (rooms[i][1] == null) {
					rooms[i][1] = socket;
					if (rooms[i][0] == null) { //game cannot start
						console.log('Client must wait. NOOOOOOOOOOO.');
						if (room[i][1] != null) {//done for sudden disconnects
							(rooms[i][1]).emit('message',{msg: 'Game cannot start', roomIndex: i, playerIndex: 1});
						}
					}
					else { //game starts
						console.log('Two clients start the game. YAAAAAAAAAAAAY');
						if (rooms[i][0] != null && rooms[i][1] != null) {//done for sudden disconnects
							(rooms[i][0]).emit('message',{msg: 'Game start', roomIndex: i, playerIndex: 0});
							(rooms[i][1]).emit('message',{msg: 'Game start', roomIndex: i, playerIndex : 1});
						}
					}
					break;
				}
			}
		}
  });
  
  //if the client sends a disconnect signal to the server
  socket.on('disconnect', function () {
		console.log('a client disconnected');
		for (var i = 0; i < roomMaxLength; i++) {
			if (socket == rooms[i][0]) {
				rooms[i][0] = null;
				if (rooms[i][1] != null) {
					(rooms[i][1]).emit('message',{msg:'opponent vanished'});
				}
				break;
			}
			else if (socket == rooms[i][1]) {
				rooms[i][1] = null;
				if (rooms[i][0] != null) {
					(rooms[i][0]).emit('message',{msg:'opponent vanished'});
				}
				break;
			}
		}
		console.log('disconnected client removed from room list');
  });
});

server.listen((process.env.PORT || 3000), function(){
  console.log('listening on *:3000');
});





