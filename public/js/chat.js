const socket = io();

socket.on('msg', (msg) => {
	console.log(msg);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
	e.preventDefault();
	console.log('Message Sent!');
	const message = e.target.elements.message.value;
	socket.emit('sendMsg', message);
});

document.querySelector('#send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert("Your browser doesn't support Geolocation");
	}

	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	});
});
