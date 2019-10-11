const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('msg', (msg) => {
	console.log(msg);
	const html = Mustache.render(messageTemplate, {
		message: msg.text,
		createdAt: moment(msg.createdAt).format('h:mm a')
	});
	$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (url) => {
	const html = Mustache.render(locationTemplate, {
		url: url.url,
		createdAt: moment(url.createdAt).format('h:mm a')
	});
	$messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// disable button
	$messageFormButton.setAttribute('disabled', 'disabled');

	console.log('Message Sent!');
	const message = e.target.elements.message.value;
	socket.emit('sendMsg', message, (error) => {
		// enable button
		$messageFormButton.removeAttribute('disabled');
		$messageFormInput.value = '';
		$messageFormInput.focus();

		if (error) {
			return console.log(error);
		}

		console.log('The message was delivered!');
	});
});

document.querySelector('#send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert("Your browser doesn't support Geolocation");
	}

	// disable button
	$locationButton.setAttribute('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit(
			'sendLocation',
			{
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			},
			() => {
				// enable button
				$locationButton.removeAttribute('disabled');

				console.log('Location shared!');
			}
		);
	});
});
