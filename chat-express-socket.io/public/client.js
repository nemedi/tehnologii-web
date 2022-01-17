window.onload = async event => {
	const handleMessage = message => {
		const list = document.querySelector('ul');
		const item = document.createElement('li');
		item.textContent = message;
		list.appendChild(item);
	}
	const rooms = await (await fetch('/rooms')).json();
	const select = document.querySelector('select');
	rooms.forEach(room => {
		const option = document.createElement('option');
		option.textContent = room;
		select.appendChild(option);
	});
	select.onchange = event => {
		document.querySelector('ul').innerHTML = '';
		socket.emit('room', event.target.value);
		document.querySelector('input').focus();
	};
	const socket = io();
	socket.on('room', messages =>
		messages.forEach(message => handleMessage(message))
	);
	socket.on('chat', message => handleMessage(message));
	document.querySelector('input').onkeyup = event => {
		if (event.key === 'Enter'
			&& event.target.value.trim().length > 0) {
			socket.emit('chat', event.target.value.trim());
			event.target.value = '';
		}
	};
};