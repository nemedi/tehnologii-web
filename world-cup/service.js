const fetch = require('node-fetch');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzdkMjQ3NjZjNGE1ZWY2MTc1ZTU0MWMiLCJpYXQiOjE2NjkxNDU3MTksImV4cCI6MTY2OTIzMjExOX0.AielY273_gH7Ieh_UziQYQhfyT3-N67DdbQuC2hUhFY';

async function getData(path) {
	const response = await fetch(`http://api.cup2022.ir/api/v1/${path}`, {
		headers: {
			'Authorization': `Bearer ${TOKEN}`
		}
	});
	const body = await response.json();
	return body.data;
}

async function getBoard() {
	const data = await getData('team');
	const board = data.map(team => ({
			id: team.team_id,
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
			mp: team.mp,
			w: team.w,
			d: team.d,
			l: team.l,
			gf: team.gf,
			ga: team.ga,
			gd: team.gd,
			pts: team.pts
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
		homeTeam: match.home_team_en,
		awayTeam: match.away_team_en,
		homeScore: match.home_score,
		awayScore: match.away_score,
		homeFlag: match.home_flag,
		awayFlag: match.away_flag
	}))
	.sort((first, second) =>
		first.localDate.localeCompare(second.localDate));
	return matches;
}


module.exports = {getBoard, getStandings, getMatches};