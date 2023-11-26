window.onload = function() {
	function $(selector) {
		return document.querySelector(selector);
	}
	function $$(selector) {
		return document.querySelectorAll(selector);
	}
	const getView = memoizer(async view => {
		const response = await fetch(`/views/${view}.html`);
		const body = await response.text();
		return Handlebars.compile(body);
	});
	function render(view, data) {
		$('#main').innerHTML = view(data);
	};
	async function getRecords(model, filter) {
		const response = await fetch(`/models/${model}${filter ? filter : ''}`);
		return response.status === 200 ? await response.json() : [];
	}
	async function getRecord(model, id) {
		if (id.length > 0) {
			const response = await fetch(`/models/${model}/${id}`);
			return response.status === 200 ? await response.json() : {};
		} else {
			return {};
		}
	}
	async function addRecord(model, record) {
		const response = await fetch(`/models/${model}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(record)
		}).catch(error => alert(error.message));
		return response.status === 201;
	}
	async function saveRecord(model, id, record) {
		const response = await fetch(`/models/${model}/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(record)
		}).catch(error => alert(error.message));
		return response.status === 204;
	}
	async function removeRecord(model, id) {
		if (await $('#dialog').confirmDialog(`Are you sure you want to remove this from ${model}?`)) {
			const response = await fetch(`/models/${model}/${id}`, {
				method: 'DELETE'
			}).catch(error => alert(error.message));
			return response.status === 204;
		} else {
			return false;
		}
	}
	async function loadBoard() {
		const view = await getView('board');
		const data = {
			rooms: await getRecords('rooms')
		};
		for (let i = 0; i < data.rooms.length; i++) {
			const room = data.rooms[i];
			room.index = i % 4 + 1;
			room.sessions = await getRecords('sessions', `?roomId=${room.id}`);
		}
		render(view, {...data,
			width: data.rooms.length > 0 ? Math.trunc(100 / data.rooms.length) - 1 : 100
		});
	};
	async function loadSessionForm(id, roomId) {
		const view = await getView('session');
		const data = {
			rooms: await getRecords('rooms'),
			speakers: await getRecords('speakers'),
			session: await getRecord('sessions', id)
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
	async function loadRoomForm(id) {
		const view = await getView('room');
		const room = await getRecord('rooms', id);
		render(view, {...room, exists: room.id !== undefined});
		addEventListeners('rooms');
	};
	async function loadSpeakerForm(id) {
		const view = await getView('speaker');
		const speaker = await getRecord('speakers', id);
		render(view, {...speaker, exists: speaker.id !== undefined});
		addEventListeners('speakers');
	};
	function addEventListeners(model, roomId, speakerId) {
		const form = $('form');
		const id = form.getAttribute('data-id');
		const record = {};
		if (roomId) {
			record.roomId = roomId;
		}
		form.onsubmit = async (event) => {
			if (id.length === 0 && addRecord(model, record)
				|| id.length > 0 && await saveRecord(model, id, record)) {
				goTo('home');
			}
		};		
		form.onreset = event => goTo('home');
		if (id.length > 0) {
			$('.delete').onclick = async () => await removeRecord(model, id) && goTo('home');
		}
		const handler = event => record[event.target.getAttribute('data')] = event.target.value;
		$$('input[type=text],textarea')
			.forEach(element => element.onkeyup = handler);
		$$('input[type=number],input[type=time],select')
			.forEach(element => element.onchange = handler);
		if (model === 'sessions') {
			if (roomId) {
				$$('select[id=room] option')
					.forEach(option => {
						if (option.value === roomId) {
							option.selected = true;
						}
					});
			}
			if (speakerId) {
				$$('select[id=speaker] option')
					.forEach(option => {
						if (option.value === speakerId) {
							option.selected = true;
						}
					});
			}
			['speaker', 'room'].forEach(model =>
				$(`select[id=${model}]+.edit`).onclick = event => {
					const id = $(`select[id=${model}]`).value;
					goTo(`edit/${model}/${id}`);	
				});
		};
	}
	router({
		'home': () => loadBoard(),
		'add-session/:roomId': ({roomId}) => loadSessionForm('', roomId),
		'edit/:model/:id': ({model, id}) => {
			model = model.charAt(0).toUpperCase() + model.substring(1);
			eval(`load${model}Form('${id}')`);
		}
	});
	goTo('home');
}