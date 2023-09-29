const {readFileSync} = require('fs');
const PATH = 'cities.csv';
const locals = {};
function loadCities(path) {
    let content = readFileSync(path);
    locals.cities = new String(content)
        .split(/\n\r?/)
        .map(line => {
            let parts = line.split(',');
            return {
                name: parts[1],
                district: parts[2],
                inhabitants: parseInt(parts[3])
            };
        });
}
function getDistricts() {
    if (!locals.districts) {
        if (!locals.cities) {
            loadCities(PATH);
        }
        let districts = locals.cities.map(city => city.district);
        locals.districts = [...new Set(districts)].sort();
    }
    return locals.districts;
}
function getCitiesByDistrict(district) {
    if (!locals.cities) {
        loadCities(PATH);
    }
    return locals.cities
        .filter(city => city.district === district)
        .sort((first, second) => first.name.localeCompare(second.name));
    
}
module.exports = {getDistricts, getCitiesByDistrict};