async function login() {
	const name = document.getElementById('name').value.trim();
	if (name.length > 0) {
		const response = await fetch('/users', {
			method: 'POST',
			headers: {'Content-Type': 'text/plain'},
			body: name
		});
		if (response.status === 202) {
			document.getElementById('user').innerText = name.toUpperCase();
			document.getElementById('messages').innerHTML = '';
			document.getElementById('loginForm').style.display = 'none';
			document.getElementById('chatForm').style.display = 'block';
			job = setTimeout(async() => await getMessages(0), 1000);
		} else {
			alert('User already exists.');
		}
	}		
}

async function logout() {
	const response = await fetch('/users', {
		method: 'DELETE'
	});
	if (response.status === 202) {
		if (job) {
			clearInterval(job);
		}
		document.getElementById('loginForm').style.display = 'block';
		document.getElementById('chatForm').style.display = 'none';	
	} else {
		alert('User cannot logout.');
	}
}
async function chat(event) {
	const message = document.getElementById('message').value.trim();
	if (event.key === 'Enter' && message.length > 0) {
		const response = await fetch('/messages', {
			method: 'POST',
			headers: {'Content-Type': 'text/plain'},
			body: message
		});
		if (response.status === 202) {
			document.getElementById('message').value  = '';
		} else {
			alert('Message could not be sent.');
		}
	}
}

async function getMessages(index) {
	const response = await fetch(`/messages/?index=${index}`);
	if (response.status === 200) {
		const messages = await response.json();
		index += messages.length;
		document.getElementById('messages').innerHTML +=
			messages.map(message => `<li>${message}</li>`)
				.reduce((html, item) => html += item, '');
	}
	job = setTimeout(async () => await getMessages(index), 1000);
}
