const fetch = require('node-fetch');
const cache = {};

async function fetchObject(url) {
	console.log(url);
	const response = await fetch(url);
	const object = await response.json();
	return object;
}

async function resolveDistrict(latitude, longitude) {
	let result = await fetchObject(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
	return result
		&& result.address
		&& result.address.country === 'România'
		? result.address.county
		: undefined;
}

async function resolveName(name) {
	if (cache[name]) {
		return cache[name];
	}
	var results = [];
	let object = await fetchObject(`https://nume.ottomotor.ro/get_nume.json?zoom=7&nw_lat=49.01625665778159&nw_lng=18.797607421875004&se_lat=41.60722821271717&se_lng=25.312500000000004&search=${name}`);
	if (object && object.ani) {
		results = await Promise.all(
				object.ani.map(async item => ({
					district: await resolveDistrict(item.area.centroid_lat, item.area.centroid_lng),
					count: item.count
				}))
			);
		results = results
			.filter(result => result.district)
			.reduce((items, item) => {
				let existingItem = items.find(i => i.district == item.district);
				if (existingItem) {
					existingItem.count += item.count;
				} else {
					items.push(item);
				}
				return items;
			}, [])
			.sort((first, second) =>
				first.count > second.count ? -1
				: (first.count < second.count ? 1 : 0));
	}
	cache[name] = results;
	return results;
}

module.exports = resolveName;