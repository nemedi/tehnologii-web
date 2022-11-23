window.onload = async () => loadBoard();

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
				.replace('${id}', team.id)
				.replace('${name}', team.name)
				.replace('${flag}', team.flag)
			)
			.reduce((html, item) => html += item, '');
	});
	Object.entries(model).forEach(([group, teams]) => {
		document.querySelectorAll(`.group.${group} .teams`)
	});	
}

async function loadStandings(group) {
	const view = await getView('standings');
	const model = await getModel(`standings/${group}`);
	document.querySelector('.content').innerHTML = view.replace('${group}', model.group);
	const template = document.querySelector('tbody').innerHTML;
	document.querySelector('tbody').innerHTML =
		model.teams.map((team, index) =>
				template
					.replace('${rank}', index + 1)
					.replace('${id}', team.id)
					.replace('${team}', team.name)
					.replace('${flag}', team.flag)
					.replace('${mp}', team.mp)
					.replace('${w}', team.w)
					.replace('${d}', team.d)
					.replace('${l}', team.l)
					.replace('${gf}', team.gf)
					.replace('${ga}', team.ga)
					.replace('${gd}', team.gd)
					.replace('${pts}', team.pts))
			.reduce((html, item) => html += item, '');
}

async function loadMatches(team) {
	const view = await getView('matches');
	const model = await getModel(`matches/${team}`);
	document.querySelector('.content').innerHTML = view;
	const template = document.querySelector('ol').innerHTML;
	document.querySelector('ol').innerHTML = model.map(match =>
			template
				.replace('${localDate}', match.localDate)
				.replace('${homeTeam}', match.homeTeam)
				.replace('${awayTeam}', match.awayTeam)
				.replace('${homeScore}', match.homeScore)
				.replace('${awayScore}', match.axwayScore)
		)
		.reduce((html, item) => html += item, '');
}

async function getView(view) {
	const response = await fetch(`/views/${view}.html`);
	const body = await response.text();
	return body;
}

async function getModel(path) {
	const response = await fetch(`/${path}`);
	const body = await response.json();
	return body;
}