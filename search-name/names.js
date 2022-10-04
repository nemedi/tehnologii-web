const fetch = require('node-fetch');

async function getObjectFromUrl(url) {
	try {
		const response = await fetch(url);
		const text = await response.text();
		return JSON.parse(text);
	} catch (e) {
		console.log(e);
	}
}

async function resolveDistrict(latitude, longitude) {
	const object = await getObjectFromUrl(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
	return object && object.address && object.address.country === 'România'
		? object.address.county
		: undefined;
}

async function resolveName(name) {
	var results = [];
	const object = await getObjectFromUrl(`https://nume.ottomotor.ro/get_nume.json?zoom=7&nw_lat=49.5822260446217&nw_lng=19.423828125000004&se_lat=42.18782901059085&se_lng=30.662841796875004&search=${name}`);
	if (object && object.ani) {
		const districts = [];
		for (var item of object.ani) {
			const district = await resolveDistrict(item.area.centroid_lat, item.area.centroid_lng);
			if (district) {
				districts.push({
					count: item.count,
					district: district
				});
			}
		}
		results = districts.sort((first, second) =>
			first.count > second.count ? -1
			: (first.count < second.count ? 1 : 0))		
		.reduce((districts, item) => {
			const district = districts.find(i => i.district === item.district);
			if (district) {
				district.count += item.count;
			} else {
				districts.push({district: item.district, count: item.count});
			}
			return districts;
		}, []);
	}
	return results;
}

module.exports = resolveName;