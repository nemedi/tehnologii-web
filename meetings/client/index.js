const application = {
	saveItem(model, id, properties) {
		let data = {};
		data.id = id;
		if (properties.reduce((valid, name) => {
			if (valid) {
				let value = document.getElementById(name + id).value;
				if (value.length === 0) {
					valid = false;
				} else {
					data[name] = value;
				}
			}
			return valid;
		}, true)) {
			fetch(`/models/${model}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			})
			.then(response => {
				if (id === 0 && response.status === 204) {
					let render = new Event('render');
					render.model = model;
					window.dispatchEvent(render);
				}
			});
		}
	},
	removeItem(model, id) {
		if (confirm('Are you sure you want to delete this record?')) {
			fetch(`/models/${model}/${id}`, {method: 'DELETE'})
			.then(response => {
				if (response.status === 204) {
					let render = new Event('render');
					render.model = model;
					window.dispatchEvent(render);
				}
			});
		}
	},
	run() {
		function loadTemplate(model) {
			return new Promise(function(resolve) {
				fetch(`/views/${model}.html`)
				.then(response => response.text())
				.then(text => resolve(Handlebars.compile(text)));
			});
		}
		function loadModel(model) {
			return new Promise(function(resolve) {
				fetch(`/models/${model}`)
				.then(response => response.json())
				.then(data => resolve(data));
			});
		}
		function render(template, data) {
			document.getElementById('main').innerHTML = template(data);
		}
		function loadRooms() {
			loadTemplate('rooms')
			.then(template =>
				loadModel('rooms')
				.then(rooms =>
					render(template, {rooms})));
		}
		function loadContacts() {
			loadTemplate('contacts')
			.then(template =>
				loadModel('contacts')
				.then(contacts =>
					render(template, {contacts})));
		}
		function loadMeetings() {
			loadTemplate('meetings')
			.then(template => {
				var data = {};
				loadModel('meetings')
				.then(meetings => {
					data.meetings = meetings;
					return loadModel('rooms');
				})
				.then(rooms => {
					data.rooms = rooms;
					return loadModel('contacts');
				})
				.then(contacts => {
					data.contacts = contacts;
					render(template, data);
				});
			});
		}
		const router = {
			rooms: loadRooms,
			contacts: loadContacts,
			meetings: loadMeetings
		};
		window.addEventListener('render', event => (router[event.model])());
		window.addEventListener('hashchange', event => {
			let index = event.newURL.indexOf('#');
			if (index > -1) {
				event.preventDefault();
				let model = event.newURL.substring(index + 1);
				let render = new Event('render');
				render.model = model;
				window.dispatchEvent(render);
			}
		});
	}
};