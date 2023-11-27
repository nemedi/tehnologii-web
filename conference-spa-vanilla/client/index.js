window.onload = function() {
	const getView = memoizer(async view =>
		await (await fetch(`/views/${view}.html`)).text()
	);
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
		let context = {
			rooms: await getRecords('rooms')
		};
		for (let room of context.rooms) {
			room.sessions = await getRecords('sessions', `?roomId=${room.id}`);
		}
		render(view, {...context,
			width: context.rooms.length > 0 ? Math.trunc(100 / context.rooms.length) - 1 : 100
		});
	}
	async function loadForm(model, id, roomId) {
		let view = await getView(model);
		let context = await getRecord(`${model}s`, id);
		if (model === 'session') {
			if (!context.roomId && roomId) {
				context.roomId = roomId;
			}
			context = {...context,
				rooms: await getRecords('rooms'),
				speakers: await getRecords('speakers')
			};
		}
		render(view, context);
		addHandlers(model);
	};
	function addHandlers(model) {
		const form = $('form');
		const id = form.getAttribute('data-id');
		const record = {};
		form.action = 'javascript:void(0)';
		form.onsubmit = async () => {
			if (id.length === 0 && addRecord(`${model}s`, record)
				|| id.length > 0 && await saveRecord(`${model}s`, id, record)) {
				goTo('home');
			}
		};		
		form.onreset = () => goTo('home');
		if ($('.delete')) {
			$('.delete').onclick = () => goTo(`remove/${model}/${id}`);
		}
		const handler = event => record[event.target.getAttribute('data')] = event.target.value;
		$$('input[type=text],textarea,input[type=number],input[type=time],select')
			.forEach(element => element.onchange = handler);
		if (model === 'session') {
			['speaker', 'room'].forEach(selector =>
				$(`select[data=${selector}Id]+.edit`).onclick = () => {
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