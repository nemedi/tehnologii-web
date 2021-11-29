function load() {
	document.getElementsByTagName("input")[0].onkeyup = addItem;
	loadItems();
}

async function loadItems() {
	const response = await fetch('/items');
	if (response.status === 200) {
		const items = await response.json();
		items.forEach(({id, text}) => appendListItem(id, text));
	}
}

function appendListItem(id, text) {
	const item = document.createElement('li');
	item.data = id;
	const anchor = document.createElement('a');
	anchor.href = 'javascript:void(0)';
	anchor.onclick = () => removeItem(item);
	anchor.innerText = text;
	item.appendChild(anchor);
	document.getElementsByTagName('ul')[0].appendChild(item);
}

async function addItem(event) {
	const text = event.target.value.trim();
	if (event.keyCode === 13 && text.length > 0) {
		const response = await fetch('/items', {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain'
			},
			body: text
		});
		if (response.status === 201) {
			const item = await response.json();
			appendListItem(item.id, text);
		}
		event.target.value = '';
	}
}

async function removeItem(item) {
	const response = await fetch(`/items/${item.data}`, {
		method: 'DELETE'
	});
	if (response.status === 204) {
		item.parentNode.removeChild(item);
	} else {
		alert('Item could not be removed.');
	}
}