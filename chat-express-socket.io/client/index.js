window.onload = async () => {
	function addMessage(message) {
		const list = document.querySelector('ul');
		const item = document.createElement('li');
		item.textContent = message;
		list.appendChild(item);
	}
	const select = document.querySelector('select');
	const rooms = await (await fetch('/rooms')).json();
	rooms.forEach(room => {
		const option = document.createElement('option');
		option.textContent = room;
		select.appendChild(option);
	});
	const socket = io();
	select.onchange = event => {
		document.querySelector('ul').innerHTML = '';
		socket.emit('room', event.target.value);
		document.querySelector('input').focus();
	};
	socket.on('room', messages =>
		messages.forEach(message => addMessage(message))
	);
	socket.on('chat', message => addMessage(message));
	document.querySelector('input').onkeyup = event => {
		if (event.key === 'Enter'
			&& event.target.value.trim().length > 0) {
			socket.emit('chat', event.target.value.trim());
			event.target.value = '';
		}
	};
};