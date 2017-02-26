var socket = io.connect('/');
//game is a global var
var roomIndex = -1;
var playerIndex = -1;
var connected = false;

socket.on('message', function (data) {
	if (data.msg && data.msg == 'rand wall') {
		console.log('client accepted new rand wall');
		createWallFromServer(data.randWall);
	}
	else if (data.msg && data.msg == 'opponent position') {
		console.log('client accepted opponent position');
		updateOpponentPos(data.x,data.y);
	}
	else if (data.msg && data.msg == 'you win') {
		console.log('client accepted you win signal');
		setYouWin();
	}
	else if (data.msg && data.msg == 'game start') {
		console.log('client and opponent start game together');
		sendStartToGame();
	}
	else if (data.msg && data.msg == 'opponent vanished') {
		console.log('client laughes at cowardly opponent');
		connected = false;
		setBackToWait();
	}
	else if (data.msg && data.msg == 'Hello from server') {
		console.log('client responds to server\'s introduction.');
		socket.emit('message',{msg : 'Hello from client'});
	}
	else if (data.msg && data.msg == 'Game cannot start') {
		console.log('Client has to wait. NOOOOOOOOOOOOOOOOOO.');
		roomIndex = data.roomIndex;
		playerIndex = data.playerIndex;
	}
	else if (data.msg && data.msg == 'Countdown start') {
		console.log('Two clients can begin. YAAAAAAAAAAAAAAAAAAAAY.');
		connected = true;
		roomIndex = data.roomIndex;
		playerIndex = data.playerIndex;
		startCountdown(10);
	}
});

var startCountdown = function(sec) {
	var timer = setInterval(function(){
		if (connected == false) { //stop countdown if player leaves.
			clearInterval(timer);
		}
		else if (sec < 0) {
			socket.emit('message',{msg: 'timer finished', room: roomIndex, player: playerIndex});
			clearInterval(timer);
		}
		else {
			sendCountdownToGame(sec); 
			sec = sec - 1;
		}
	}, 1000);
};
