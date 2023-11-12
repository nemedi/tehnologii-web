window.onload = async () => loadBoard();

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
		Object.getOwnPropertyNames(model)
			.map(item =>
				template.replaceAll('${group}', item)
			)
			.reduce((html, item) => html += item, '');
	Object.entries(model).forEach(([group, teams]) => {
		const element = document.querySelector(`.group.${group} .teams`);
		const template = element.innerHTML;
		element.innerHTML = teams.map(item => template
				.replaceAll('${team}', item)
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
		model.map((item, index) =>
				template
					.replaceAll('${rank}', index + 1)
					.replaceAll('${team}', item.team)
					.replaceAll('${mp}', item.mp)
					.replaceAll('${w}', item.w)
					.replaceAll('${d}', item.d)
					.replaceAll('${l}', item.l)
					.replaceAll('${gf}', item.gf)
					.replaceAll('${ga}', item.ga)
					.replaceAll('${gd}', item.gd)
					.replaceAll('${pts}', item.pts))
			.reduce((html, item) => html += item, '');
}

async function loadMatches(team) {
	const view = await getView('matches');
	const model = await getModel(`matches/${team}`);
	document.querySelector('.content').innerHTML = view;
	const template = document.querySelector('.match').innerHTML;
	document.querySelector('.match').innerHTML = model.map(item =>
			template
				.replaceAll('${stage}', item.stage)
				.replaceAll('${date}', item.date)
				.replaceAll('${homeTeam}', item.homeTeam)
				.replaceAll('${awayTeam}', item.awayTeam)
				.replaceAll('${homeScore}', item.homeScore)
				.replaceAll('${awayScore}', item.awayScore)
		)
		.reduce((html, item) => html += item, '');
}

