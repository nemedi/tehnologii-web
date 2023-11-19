const {readFileSync} = require('fs');
module.exports = function(path) {
    const repository = JSON.parse(readFileSync(path));
    return {
        getBoard() {
            return repository.groups;
        },
        getStandings(group) {
            return repository.standings[group];
        },
        getMatches(team) {
            return repository.matches.filter(match =>
                match.homeTeam === team || match.awayTeam === team
            );
        }
    }
}