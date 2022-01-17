window.onload = event => {
	const socket = io();
	const handleMessage = message => {
		const list = document.querySelector('ul');
		const item = document.createElement('li');
		item.textContent = message;
		list.appendChild(item);
	}
	socket.on('messages', messages =>
		messages.forEach(message => handleMessage(message))
	);
	socket.on('message', message => handleMessage(message));
	document.querySelector('input').onkeyup = event => {
		if (event.key === 'Enter'
			&& event.target.value.trim().length > 0) {
			socket.emit('message', event.target.value.trim());
			event.target.value = '';
		}
	};
};