const fetch = require('node-fetch');

const EMAIL = 'inemedi@ie.ase.ro';
const PASSWORD = 'szervusz';

// https://github.com/raminmr/free-api-worldcup2022

async function getToken(email, password) {
	const response = await fetch('http://api.cup2022.ir/api/v1/user/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email, password})
	});
	const body = await response.json();
	return body.data.token;
}

async function getData(path) {
	const token = await getToken(EMAIL, PASSWORD);
	const response = await fetch(`http://api.cup2022.ir/api/v1/${path}`, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	const body = await response.json();
	return body.data;
}

async function getBoard() {
	const data = await getData('team');
	const board = data.map(team => ({
			id: team.id,
			name: team.name_en,
			flag: team.flag,
			group: team.groups
		}))
		.reduce((groups, team) => {
			if (!groups[team.group]) {
				groups[team.group] = [];
			}
			groups[team.group].push(team);
			delete team.group;
			return groups;
		}, {});
	return sortObject(board);
}

function sortObject(unordered) {
	return Object.keys(unordered)
		.sort()
		.reduce((object, key) => { 
			object[key] = unordered[key]; 
			return object;
		}, {});
}

async function getStandings(group) {
	const data = await getData(`standings/${group}`);
	const standings = {group};
	standings.teams = data[0].teams
		.map(team => ({
			id: team.team_id,
			name: team.name_en,
			flag: team.flag,
			mp: parseInt(team.mp),
			w: parseInt(team.w),
			d: parseInt(team.d),
			l: parseInt(team.l),
			gf: parseInt(team.gf),
			ga: parseInt(team.ga),
			gd: parseInt(team.gd),
			pts: parseInt(team.pts)
		}))
		.sort((first, second) => {
			let result = second.pts - first.pts;
			if (result === 0) {
				results = second.gd - first.gd;
			}
			if (result === 0) {
				result = second.gf - first.gf;
			}
			return result;
		});
	return standings;
}

async function getMatches(team) {
	const data = await getData(`match/${team}`);
	const matches = data.map(match => ({
		localDate: match.local_date,
		homeId: match.home_team_id,
		awayId: match.away_team_id,
		homeTeam: match.home_team_en,
		awayTeam: match.away_team_en,
		homeScore: parseInt(match.home_score),
		awayScore: parseInt(match.away_score),
		homeFlag: match.home_flag,
		awayFlag: match.away_flag
	}))
	.sort((first, second) =>
		first.localDate.localeCompare(second.localDate));
	return matches;
}


module.exports = {getBoard, getStandings, getMatches};