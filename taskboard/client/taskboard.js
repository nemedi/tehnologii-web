HTMLElement.prototype.taskBoard = function(tasksByStatus, changeTaskStatus) {
	this.innerHTML = '';
	this.className = 'container';
	function updateCards(cards) {
		cards.querySelectorAll('p').forEach((description, i) => {
			var text = description.innerText;
			text = text.substring(text.indexOf('.'));
			description.innerText = `${i + 1}${text}`;
		});
	}
	Object.entries(tasksByStatus).forEach(([status, tasks], i) => {
		const column = document.createElement('div');
		column.className = `column background${i % 4 + 1}`;
		column.style.width = Math.floor(100 / Object.keys(tasksByStatus).length - 1) + '%';
		const title = document.createElement('p');
		title.className = 'column-title';
		title.innerText = status;
		const cards = document.createElement('div');
		cards.className = 'cards';
		tasks.forEach((task, j) => {
			const card = document.createElement('div');
			card.id = `card_${i + 1}_${j + 1}`;
			card.className = `card background${i % 4 + 1}`;
			card.draggable = true;
			card.ondragstart = event => event.dataTransfer.setData('id', card.id);
			const description = document.createElement('p');
			description.innerText = `${j + 1}. ${task}`;
			card.appendChild(description);
			cards.appendChild(card);
		});
		const footer = document.createElement('div');
		footer.className = `column-footer color${i % 4 + 1}`;
		footer.innerText = 'Drop task here.';
		footer.ondragover = event => event.preventDefault();
		footer.ondrop = async event => {
			event.preventDefault();
			const card = document.getElementById(event.dataTransfer.getData('id'));
			const oldParent = card.parentNode;
			const newParent = event.target.parentNode.querySelector('.cards');
			let task = card.querySelector('p').innerText;
			task = task.substring(task.indexOf('.') + 1);
			let oldStatus = oldParent.parentNode.querySelector('p').innerText;
			let newStatus = newParent.parentNode.querySelector('p').innerText;
			if (await changeTaskStatus(task, oldStatus, newStatus)) {
				oldParent.removeChild(card);
				newParent.appendChild(card);
				card.className = card.className.substring(0, card.className.length - 1)
					+ event.target.className.substring(event.target.className.length - 1);
				updateCards(oldParent);
				updateCards(newParent);
			}
		};
		column.appendChild(title);		
		column.appendChild(cards);
		column.appendChild(footer);
		this.appendChild(column);
	});
}