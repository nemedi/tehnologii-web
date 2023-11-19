HTMLElement.prototype.tasks = function(data) {
	function createItem(task) {
		const item = document.createElement('li');
		const link = document.createElement('a');
		link.innerText = task.description;
		link.setAttribute('href', 'javascript:void(0)');
		link.addEventListener('click', async event => {
			const response = await fetch(`/tasks/${task.id}`, {method: 'DELETE'});
			if (response.status === 204) {
				event.target.parentNode.parentNode.removeChild(event.target.parentNode);
			}
		});
		item.appendChild(link);
		return item;
	};
	const title = document.createElement('h1');
	title.innerText = data.title;
	this.appendChild(title);
	var paragraph = document.createElement('p');
	const list = document.createElement('ul');
	data.tasks.forEach(task => list.appendChild(createItem(task)));
	paragraph.appendChild(list);
	this.appendChild(paragraph);
	var paragraph = document.createElement('p');
	const span = document.createElement('span');
	span.innerText = 'New Task: ';
	paragraph.appendChild(span);
	const input = document.createElement('input');
	input.setAttribute('id', 'task');
	paragraph.appendChild(input);
	this.appendChild(paragraph);
	var paragraph = document.createElement('p');
	const button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.setAttribute('value', 'Add Task');
	button.addEventListener('click', async event => {
		const response = await fetch(`/tasks`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
				body: `task=${document.getElementById('task').value}`
			});
		const task = await response.json();
		list.appendChild(createItem(task));
		document.getElementById('task').value = '';
	});
	paragraph.appendChild(button);
	this.appendChild(paragraph);
}