window.onload = async () => loadBoard();
window.addEventListener('render', event => eval(event.call));
window.addEventListener('hashchange', event => {
	let index = event.newURL.indexOf('#');
	if (index > -1) {
		event.preventDefault();
		let call = event.newURL.substring(index + 1);
		let render = new Event('render');
		render.call = call;
		window.dispatchEvent(render);
	}
});

String.prototype.replaceVariables = function(context) {
	return Object.entries(context).reduce((result, [key, value]) =>
		result.replaceAll('${' + key + '}', decodeURI(value)), this);
}

const views = {};

async function getView(view) {
	if (!views[view]) {
		const response = await fetch(`/views/${view}.html`);
		const body = await response.text();
		views[view] = body;
	}
	return views[view];
}

async function getModel(path) {
	const response = await fetch(`/${path}`);
	const body = await response.json();
	return body;
}

async function loadBoard() {
	const view = await getView('board');
	const model = await getModel('board');
	document.querySelector('.content').innerHTML = view;
	const template = document.querySelector('.board').innerHTML;
	document.querySelector('.board').innerHTML =
		Object.keys(model)
			.map(group =>
				template.replaceVariables({group})
			)
			.reduce((html, item) => html += item, '');
	Object.entries(model).forEach(([group, teams]) => {
		const element = document.querySelector(`.group.${group} .teams`);
		const template = element.innerHTML;
		element.innerHTML = teams.map(team =>
				template.replaceVariables({team})
			)
			.reduce((html, item) => html += item, '');
	});
}

async function loadStandings(group) {
	const view = await getView('standings');
	const model = await getModel(`standings/${group}`);
	document.querySelector('.content').innerHTML = view.replaceAll('${group}', group);
	const template = document.querySelector('tbody').innerHTML;
	document.querySelector('tbody').innerHTML =
		model.map((standing, index) => 
				template.replaceVariables({rank: index + 1,...standing})
			)
			.reduce((html, item) => html += item, '');
}

async function loadMatches(team) {
	const view = await getView('matches');
	const model = await getModel(`matches/${team}`);
	document.querySelector('.content').innerHTML = view.replaceVariables({team});
	const template = document.querySelector('.match').innerHTML;
	document.querySelector('.match').innerHTML = model.map(match =>
			template.replaceVariables(match)
		)
		.reduce((html, item) => html += item, '');
}

