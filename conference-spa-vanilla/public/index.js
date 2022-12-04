function main() {
	window.addEventListener('render', event => eval(event.call));
	window.addEventListener('hashchange', event => {
		let index = event.newURL.indexOf('#');
		if (index > -1) {
			event.preventDefault();
			let call = event.newURL.substring(index + 1);
			let render = new Event('render');
			render.call = call;
			window.dispatchEvent(render);
		}
	});	
	const views = {};
	async function loadView(view) {
		if (!views[view]) {
			const response = await fetch(`/views/${view}.html`);
			views[view] = await response.text();
		}
		return Handlebars.compile(views[view]);
	};
	function render(view, data) {
		document.getElementById('main').innerHTML = view(data);
	};
	async function loadCollection(collection, filter) {
		const response = await fetch(`/models/${collection}${filter ? filter : ''}`);
		return response.status === 200 ? await response.json() : [];
	}
	async function loadRecord(collection, id) {
		if (id.length > 0) {
			const response = await fetch(`/models/${collection}/${id}`);
			return response.status === 200 ? await response.json() : {};
		} else {
			return {};
		}
	}
	async function loadBoard() {
		window.location.href = '#loadBoard()';
		const view = await loadView('board');
		const data = {
			rooms: await loadCollection('rooms')
		};
		for (let i = 0; i < data.rooms.length; i++) {
			const room = data.rooms[i];
			room.index = i % 4 + 1;
			room.sessions = await loadCollection('sessions', `?roomId=${room.id}`);
		}
		render(view, {...data,
			width: data.rooms.length > 0 ? Math.trunc(100 / data.rooms.length) - 1 : 100
		});
	};
	async function editSession(id, roomId) {
		const view = await loadView('session');
		const data = {
			rooms: await loadCollection('rooms'),
			speakers: await loadCollection('speakers'),
			session: await loadRecord('sessions', id)
		};
		data.session.exists = data.session.id !== undefined;
		if (!data.session.roomId && roomId) {
			data.session.roomId = roomId;
		}
		render(view, data);
		addEventListeners('sessions',
			data.session.roomId,
			data.session.speakerId);
	};
	async function editRoom(id) {
		const view = await loadView('room');
		const room = await loadRecord('rooms', id);
		render(view, {...room, exists: room.id !== undefined});
		addEventListeners('rooms');
	};
	async function editSpeaker(id) {
		const view = await loadView('speaker');
		const speaker = await loadRecord('speakers', id);
		render(view, {...speaker, exists: speaker.id !== undefined});
		addEventListeners('speakers');
	};
	function addEventListeners(collection, roomId, speakerId) {
		const form = document.querySelector('form');
		const id = form.getAttribute('data-id');
		form.action = 'javascript:void(0)';
		const record = {};
		if (roomId) {
			record.roomId = roomId;
		}
		form.onsubmit = async (event) => {
			const response = await fetch(`/models/${collection}/${id}`, {
				method: id ? 'PATCH' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(record)
			}).catch(error => alert(error.message));
			if (response.status === (id.length > 0 ? 204 : 201)) {
				window.location.href = '#loadBoard()';
			}
		};		
		form.onreset = event => window.location.href = '#loadBoard()';
		if (id.length > 0) {
			document.querySelector('.delete').onclick = async (event) => {
				if (id && await document.getElementById('dialog')
					.confirmDialog(`Are you sure you want to remove this from ${collection}?`)) {
					const response = await fetch(`/models/${collection}/${id}`, {
						method: 'DELETE'
					}).catch(error => alert(error.message));
					if (response.status === 204) {
						window.location.href = '#loadBoard()';
					}
				}
			};
		}
		const handler = event => record[event.target.getAttribute('data')] = event.target.value;
		document.querySelectorAll('input[type=text],textarea')
			.forEach(element => element.onkeyup = handler);
		document.querySelectorAll('input[type=number],input[type=time],select')
			.forEach(element => element.onchange = handler);
		if (collection === 'sessions') {
			if (roomId) {
				document.querySelectorAll('select[id=room] option').forEach(option => {
					if (option.value === roomId) {
						option.selected = true;
					}
				});
			}
			if (speakerId) {
				document.querySelectorAll('select[id=speaker] option').forEach(option => {
					if (option.value === speakerId) {
						option.selected = true;
					}
				});
			}
			['speaker', 'room'].forEach(model =>
				document.querySelector(`select[id=${model}]+.edit`).onclick = event => {
					const id = document.querySelector(`select[id=${model}]`).value;
					window.location.href = `#edit${model.charAt(0).toUpperCase()}${model.substring(1)}('${id}')`;	
				});
		};
	}
	loadBoard();
}