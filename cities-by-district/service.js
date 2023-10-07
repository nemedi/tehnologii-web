const {readFileSync} = require('fs');
const PATH = 'cities.csv';
const cache = {};
function loadCities(path) {
    let content = readFileSync(path);
    cache.cities = new String(content)
        .split(/\n\r?/)
        .map(line => {
            let parts = line.split(',');
            return {
                name: parts[1],
                district: parts[2],
                inhabitants: parseInt(parts[3])
            };
        })
        .sort((first, second) => first.name.localeCompare(second.name));
}
function getDistricts() {
    if (!cache.districts) {
        if (!cache.cities) {
            loadCities(PATH);
        }
        let districts = cache.cities.map(city => city.district);
        cache.districts = [...new Set(districts)].sort();
    }
    return cache.districts;
}
function getCitiesByDistrict(district) {
    if (!cache.cities) {
        loadCities(PATH);
    }
    return cache.cities.filter(city => city.district === district);
}
module.exports = {getDistricts, getCitiesByDistrict};