window.onload = async event => {
	function addItemToList(text, id) {
		const list = document.getElementById(id);
		const item = document.createElement('li');
		item.textContent = text;
		list.appendChild(item);
	}
	function removeItemFromList(text, id) {
		const list = document.getElementById(id);
		list.childNodes.filter(c => c.textContent === text)
			.forEach(list.removeChild(c));
	}
	function clearList(id) {
		const list = document.getElementById(id);
		list.innerHTML = '';
	}
	const roomControl = document.getElementById('room');
	const rooms = await (await fetch('/rooms')).json();
	rooms.forEach(r => {
		const option = document.createElement('option');
		option.textContent = r;
		roomControl.appendChild(option);
	});
	const socket = io();
	roomControl.onchange = event => {
		let room = event.target.value;
		if (room) {
			let user = document.getElementById('user').value.trim();
			if (user) {
				socket.emit('join', {user, room});
			}
		} else {
			socket.emit('leave');
		}
	};
	const messageControl = document.getElementById('message');
	messageControl.onkeyup = event => {
		if (event.key === 'Enter') {
			let text = event.target.value.trim();
			if (text.length > 0) {
				socket.emit('chat', text);
			}
		}
	};
	socket.on('enter', ({users, messages}) => {
		clearList('users');
		users.forEach(u => addItemToList(u, 'users'));
		clearList('messages');
		messages.forEach(({from, text}) => addItemToList(`${from}: ${text}`, 'messages'));
	})
	socket.on('deny', reason => alert(reason));
	socket.on('exit', () => {
		clearList('users');
		clearList('messages');
	})
	socket.on('userJoined',  user => addItemToList(user, 'users'));
	socket.on('userLeft',  user => removeItemFromList(user, 'users'));
	socket.on('chat', ({from, text}) => addItemToList(`${from}: ${text}`, 'messages'))
};