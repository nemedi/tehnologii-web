window.onload = async function load() {
    document.getElementsByTagName('input')[0].onkeyup = addItem;
    const response = await fetch('/items');
    if (response.status === 200) {
        const body = await response.json();
        body.forEach(({id, text}) => appendItem(id, text));
    }
}

async function addItem(event) {
    const text = event.target.value.trim();
    if (event.key === 'Enter' && text.length > 0) {
        const response = await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text
        });
        if (response.status === 201) {
            const body = await response.text();
            appendItem(body, text);
        }
        event.target.value = '';
    }
}

async function changeItem(event) {
    const text = event.target.value.trim();
    if (event.key === 'Enter' && text.length > 0) {
        const response = await fetch(`/items/${event.target.data}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text
        });
        if (response.status === 204) {
            alert('Item was saved.');
        } else {
            alert('Item could not be saved.');
        }
    }
}

async function removeItem(listItem) {
    if (confirm('Are you sure you want to delete this item?')) {
        const response = await fetch(`/items/${listItem.data}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            listItem.parentNode.removeChild(listItem);
        } else {
            alert('Item could not be removed.');
        }
    }
}

function appendItem(id, text) {
    const listItem = document.createElement('li');
    listItem.data = id;
    const input = document.createElement('input');
    input.data = id;
    input.value = text;
    input.onkeyup = changeItem;
    listItem.appendChild(input);
    const anchor = document.createElement('a');
    anchor.innerText = 'Remove';
    anchor.href = 'javascript:void(0)';
    anchor.onclick = () => removeItem(listItem);
    listItem.appendChild(anchor);
    document.getElementsByTagName('ul')[0].appendChild(listItem);
}