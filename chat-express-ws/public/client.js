window.onload = async event => {
	const handleMessage = message => {
		const list = document.querySelector('ul');
		const item = document.createElement('li');
		item.textContent = message;
		list.appendChild(item);
	};
	const rooms = await (await fetch('/rooms')).json();
	const select = document.querySelector('select');
	rooms.forEach(room => {
		const option = document.createElement('option');
		option.textContent = room;
		select.appendChild(option);
	});
	select.onchange = event => {
		document.querySelector('ul').innerHTML = '';
		socket.send(JSON.stringify({type: 'room', payload: event.target.value}));
		document.querySelector('input').focus();
	};
	const socket = new WebSocket(window.location.origin.replace(/^http/, 'ws'));
	socket.onmessage = event => {
		const {type, payload} = JSON.parse(event.data);
		switch (type) {
			case 'room':
				payload.forEach(message => handleMessage(message));
				break;
			case 'chat':
				handleMessage(payload);
				break;
		}
	};
	document.querySelector('input').onkeyup = event => {
		if (event.key === 'Enter'
			&& event.target.value.trim().length > 0) {
			socket.send(JSON.stringify({
				type: 'chat',
				payload: event.target.value.trim()
			}));
			event.target.value = '';
		}
	};
};