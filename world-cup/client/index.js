window.addEventListener('load', () => loadBoard());
window.addEventListener('render', event => eval(decodeURI(event.call)));
window.addEventListener('hashchange', event => {
	let index = event.newURL.indexOf('#');
	if (index > -1) {
		event.preventDefault();
		let renderEvent = new Event('render');
		renderEvent.call = event.newURL.substring(index + 1);
		window.dispatchEvent(renderEvent);
	}
});
String.prototype.$ = function(context) {
	return Object.entries(context).reduce((result, [key, value]) =>
		result.replaceAll('${' + key + '}', value), this);
}
function $(selector) {
	return document.querySelector(selector);
}
function memoizer(method) {
    const cache = {};
    return function() {
        const key = [...arguments].toString();
        if (cache[key] === undefined) {
            cache[key] = method.apply(this, arguments);
        }
        return cache[key];
    };
}
const getView = memoizer(async view =>
	await (await fetch(`/views/${view}.html`)).text()
);
const getModel = memoizer(async path =>
	await (await fetch(`/${path}`)).json()
);
async function loadBoard() {
	const view = await getView('board');
	const model = await getModel('board');
	$('.content').innerHTML = view;
	const _ = $('.board').innerHTML;
	$('.board').innerHTML =
		Object.keys(model).map(group =>	_.$({group})).join('');
	Object.entries(model).forEach(([group, teams]) => {
		const _ = $(`.group.${group} .teams`).innerHTML;
		$(`.group.${group} .teams`).innerHTML = 
			teams.map(team => _.$({team})).join('');
	});
}
async function loadStandings(group) {
	const view = await getView('standings');
	const model = await getModel(`standings/${group}`);
	$('.content').innerHTML = view.$({group});
	const _ = $('tbody').innerHTML;
	$('tbody').innerHTML =
		model.map((standing, index) => _.$({rank: index + 1,...standing})).join('');
}
async function loadMatches(team) {
	const view = await getView('matches');
	const model = await getModel(`matches/${team}`);
	$('.content').innerHTML = view.$({team});
	const _ = $('.match').innerHTML;
	$('.match').innerHTML =
		model.map((match, index) => _.$({number: index + 1, ...match})).join('');
}