HTMLElement.prototype.tasks = function(data, {addTask, removeTask}) {
	function createItem(task) {
		const item = document.createElement('li');
		const link = document.createElement('a');
		link.innerText = task.description;
		link.setAttribute('href', 'javascript:void(0)');
		link.addEventListener('click', async event => {
			if (await removeTask(task.id)) {
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
		let task = await addTask(`task=${document.getElementById('task').value}`);
		if (task) {
			list.appendChild(createItem(task));
			document.getElementById('task').value = '';
		}
	});
	paragraph.appendChild(button);
	this.appendChild(paragraph);
}