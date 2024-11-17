HTMLElement.prototype.tasks = function(data, {addTask, removeTask}) {
	const title = document.createElement('h1');
	title.innerText = data.title;
	this.appendChild(title);
	const form = document.createElement('form');
	form.setAttribute('action', addTask);
	form.setAttribute('method', 'post');
	var paragraph = document.createElement('p');
	const list = document.createElement('ul');
	data.tasks.forEach(task => {
		const item = document.createElement('li');
		const link = document.createElement('a');
		link.innerText = task.description;
		link.setAttribute('href', `${removeTask}/${task.id}`);
		item.appendChild(link);
		list.appendChild(item);
	});
	paragraph.appendChild(list);
	form.appendChild(paragraph);
	var paragraph = document.createElement('p');
	const span = document.createElement('span');
	span.innerText = 'New Task: ';
	paragraph.appendChild(span);
	const input = document.createElement('input');
	input.setAttribute('name', 'task');
	paragraph.appendChild(input);
	form.appendChild(paragraph);
	var paragraph = document.createElement('p');
	const button = document.createElement('input');
	button.setAttribute('type', 'submit');
	button.setAttribute('value', 'Add Task');
	paragraph.appendChild(button);
	form.appendChild(paragraph);
	this.appendChild(form);
}