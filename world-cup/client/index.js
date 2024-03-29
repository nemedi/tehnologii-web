window.onload = () => goTo('home');
const getView = memoizer(async view =>
	await (await fetch(`/views/${view}.html`)).text()
);
const getModel = memoizer(async path =>
	await (await fetch(`/api/${path}`)).json()
);
async function loadBoard() {
	const view = await getView('board');
	const model = await getModel('board');
	$('.content').innerHTML = view;
	const _ = $('.board').innerHTML;
	$('.board').innerHTML =
		Object.keys(model).map(group =>	_.render({group})).join('');
	Object.entries(model).forEach(([group, teams]) => {
		const _ = $(`.group.${group} .teams`).innerHTML;
		$(`.group.${group} .teams`).innerHTML = 
			teams.map(team => _.render({team})).join('');
	});
}
async function loadStandings(group) {
	const view = await getView('standings');
	const model = await getModel(`standings/${group}`);
	$('.content').innerHTML = view.render({group});
	const _ = $('tbody').innerHTML;
	$('tbody').innerHTML =
		model.map((standing, index) => _.render({rank: index + 1,...standing})).join('');
}
async function loadMatches(team) {
	const view = await getView('matches');
	const model = await getModel(`matches/${team}`);
	$('.content').innerHTML = view.render({team});
	const _ = $('.match').innerHTML;
	$('.match').innerHTML =
		model.map((match, index) => _.render({number: index + 1, ...match})).join('');
}
router({
	'home': () => loadBoard(),
	'standings/:group': ({group}) => loadStandings(group),
	'matches/:team': ({team}) => loadMatches(team)
});