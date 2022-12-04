HTMLElement.prototype.confirmDialog = function(description, title, labels) {
	if (!title) {
		title = 'Confirm';
	}
	if (!labels) {
		labels = ['Yes', 'No'];
	}
	this.className = 'modal-dialog';
	this.innerHTML = '';
	const form = document.createElement('form');
	form.className = 'modal-content';
	const container = document.createElement('div');
	container.className = 'modal-container';
	const heading = document.createElement('h1');
	heading.className = 'modal-heading';
	heading.innerText = title;
	container.appendChild(heading);
	const paragraph = document.createElement('p');
	paragraph.innerText = description;
	container.appendChild(paragraph);
	const buttons = document.createElement('div');
	buttons.className = 'modal-buttons';
	container.appendChild(buttons);
	const closeDialog = () => {
		this.style.display = 'none';
	};
	const okButton = document.createElement('input');
	okButton.type = 'submit';
	okButton.value = labels[0];
//	okButton.className = 'modal-okButton';
	buttons.appendChild(okButton);
	const cancelButton = document.createElement('input');
	cancelButton.type = 'reset';
	buttons.appendChild(cancelButton);
	cancelButton.value = labels[1];
//	cancelButton.className = 'modal-cancelButton';
	form.appendChild(container);
	this.appendChild(form);
	this.style.display = 'block';
	return new Promise(resolve => {
		okButton.addEventListener('click', () => {
			closeDialog();
			resolve(true);
		});
		cancelButton.addEventListener('click', () => {
			closeDialog();
			resolve(false);
		});
	});
}
