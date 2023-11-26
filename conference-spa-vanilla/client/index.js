window.onload = function() {
	function render(view, data) {
		$('#main').innerHTML = view.render(data);
	};
	async function getRecords(model, filter) {
		const response = await fetch(`/models/${model}${filter ? filter : ''}`);
		return response.status === 200 ? await response.json() : [];
	};
	async function getRecord(model, id) {
		if (id.length > 0) {
			const response = await fetch(`/models/${model}/${id}`);
			return response.status === 200 ? await response.json() : {};
		} else {
			return {};
		}
	};
	async function addRecord(model, record) {
		if (record.id) {
			delete record.id;
		}
		const response = await fetch(`/models/${model}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(record)
		}).catch(error => alert(error.message));
		return response.status === 201;
	};
	async function saveRecord(model, id, record) {
		const response = await fetch(`/models/${model}/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(record)
		}).catch(error => alert(error.message));
		return response.status === 204;
	};
	async function removeRecord(model, id) {
		if (await $('#dialog').confirmDialog(`Are you sure you want to remove this from ${model}?`)) {
			const response = await fetch(`/models/${model}/${id}`, {
				method: 'DELETE'
			}).catch(error => alert(error.message));
			return response.status === 204;
		} else {
			return false;
		}
	};
	async function loadBoard() {
		let view = await getView('board');
		let data = {
			rooms: await getRecords('rooms')
		};
		for (let room of data.rooms) {
			room.sessions = await getRecords('sessions', `?roomId=${room.id}`);
		}
		render(view, {...data,
			width: data.rooms.length > 0 ? Math.trunc(100 / data.rooms.length) - 1 : 100
		});
	}
	async function loadForm(model, id, roomId) {
		let view = await getView(model);
		let data = await getRecord(`${model}s`, id);
		data = {...data, exists: data.id !== undefined};
		if (model === 'session') {
			if (!data.roomId && roomId) {
				data.roomId = roomId;
			}
			data = {...data,
				rooms: await getRecords('rooms'),
				speakers: await getRecords('speakers')
			};
		}
		render(view, data);
		addHandlers(model, id);
	};
	function addHandlers(model, id) {
		const form = $('form');
		form.action = 'javascript:void(0)';
		form.onsubmit = async () => {
			let data = new Array(...form.elements)
				.filter(element => element.getAttribute('data'))
				.reduce((result, element) => {
					result[element.getAttribute('data')] = element.value;
					return result;
				}, {});
			if (id.length === 0 && addRecord(`${model}s`, data)
				|| id.length > 0 && await saveRecord(`${model}s`, id, data)) {
				goTo('home');
			}
		};		
		form.onreset = () => goTo('home');
		if (id.length > 0) {
			$('.delete').onclick = () => goTo(`remove/${model}/${id}`);
		}
		if (model === 'session') {
			['speaker', 'room'].forEach(selector =>
				$(`select[data=${selector}Id]+.edit`).onclick = event => {
					const id = $(`select[data=${selector}Id]`).value;
					goTo(`edit/${selector}/${id}`);	
				});
		};
	};
	router({
		'home': () => loadBoard(),
		'add-session/:roomId': ({roomId}) => loadForm('session', '', roomId),
		'edit/:model/:id': ({model, id}) => {
			loadForm(model, id);
		},
		'remove/:model/:id': async ({model, id}) => {
			if (await removeRecord(model, id)) {
				goTo('home');
			}
		}
	});
	goTo('home');
}