const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
	console.log('New WebSocket Connection');

	socket.emit('msg', 'Welcome to the app');
	socket.broadcast.emit('msg', 'A new user has joined!');

	socket.on('sendMsg', (msg) => {
		io.emit('msg', msg);
	});

	socket.on('sendLocation', (location) => {
		io.emit('msg', `https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
	});

	socket.on('disconnect', () => {
		io.emit('msg', 'A user has left!');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});
