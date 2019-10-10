const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
	console.log('New WebSocket Connection');

	socket.emit('msg', 'Welcome to the app');
	socket.broadcast.emit('msg', 'A new user has joined!');

	socket.on('sendMsg', (msg, callback) => {
		const filter = new Filter();
		if (filter.isProfane(msg)) {
			return callback('Profanity is not allowed!');
		}

		io.emit('msg', msg);
		callback();
	});

	socket.on('sendLocation', (location, callback) => {
		io.emit('locationMessage', `https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
		callback();
	});

	socket.on('disconnect', () => {
		io.emit('msg', 'A user has left!');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});
