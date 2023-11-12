window.onload = async () => loadBoard();

const views = {};

async function loadBoard() {
	const view = await getView('board');
	const model = await getModel('board');
	document.querySelector('.content').innerHTML = view;
	const template = document.querySelector('.board').innerHTML;
	document.querySelector('.board').innerHTML =
		Object.getOwnPropertyNames(model)
			.map(group =>
				template.replaceAll('${group}', group)
			)
			.reduce((html, item) => html += item, '');
	Object.entries(model).forEach(([group, teams]) => {
		const element = document.querySelector(`.group.${group} .teams`);
		const template = element.innerHTML;
		element.innerHTML = teams.map(team => template
				.replaceAll('${team}', team)
			)
			.reduce((html, item) => html += item, '');
	});
	Object.entries(model).forEach(([group, teams]) => {
		document.querySelectorAll(`.group.${group} .teams`)
	});	
}

async function loadStandings(group) {
	const view = await getView('standings');
	const standings = await getModel(`standings/${group}`);
	document.querySelector('.content').innerHTML = view.replaceAll('${group}', group);
	const template = document.querySelector('tbody').innerHTML;
	document.querySelector('tbody').innerHTML =
		standings.map((standing, index) =>
				template
					.replaceAll('${rank}', index + 1)
					.replaceAll('${team}', standing.team)
					.replaceAll('${mp}', standing.mp)
					.replaceAll('${w}', standing.w)
					.replaceAll('${d}', standing.d)
					.replaceAll('${l}', standing.l)
					.replaceAll('${gf}', standing.gf)
					.replaceAll('${ga}', standing.ga)
					.replaceAll('${gd}', standing.gd)
					.replaceAll('${pts}', standing.pts))
			.reduce((html, item) => html += item, '');
}

async function loadMatches(team) {
	const view = await getView('matches');
	const model = await getModel(`matches/${team}`);
	document.querySelector('.content').innerHTML = view;
	const template = document.querySelector('.match').innerHTML;
	document.querySelector('.match').innerHTML = model.map(match =>
			template
				.replaceAll('${stage}', match.stage)
				.replaceAll('${date}', match.date)
				.replaceAll('${homeTeam}', match.homeTeam)
				.replaceAll('${awayTeam}', match.awayTeam)
				.replaceAll('${homeScore}', match.homeScore)
				.replaceAll('${awayScore}', match.awayScore)
		)
		.reduce((html, item) => html += item, '');
}

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