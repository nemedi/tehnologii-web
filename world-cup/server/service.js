const {readFileSync} = require('fs');
module.exports = function(path) {
    const data = JSON.parse(readFileSync(path));
    return {
        getBoard() {
            return data.groups;
        },
        getStandings(group) {
            return data.standings[group];
        },
        getMatches(team) {
            return data.matches.filter(match =>
                match.homeTeam === team || match.awayTeam === team
            );
        }
    }
}