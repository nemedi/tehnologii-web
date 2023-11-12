// https://www.marca.com/en/world-cup/teams.html
// https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/qatar2022/scores-fixtures?country=&wtw-filter=ALL
// https://www.google.com/search?q=world+cup+2022+group+standings&rlz=1C1GCEA_en&oq=world+cup+2022+grou+sta&aqs=chrome.2.69i57j0i22i30l6j69i60.6563j0j7&sourceid=chrome&ie=UTF-8#sie=lg;/m/0fp_8fm;2;/m/030q7;st;fp;1;;;

const {readFileSync} = require('fs');

module.exports = function(path) {
    const data = JSON.parse(readFileSync(path));
    return {
        getBoard: function() {
            return data.groups;
        },
        getStandings: function(group) {
            return data.standings[group];
        },
        getMatches: function(team) {
            return data.matches.filter(match => match.homeTeam === team || match.awayTeam === team);
        }
    }
}