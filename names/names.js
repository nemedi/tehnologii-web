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
	if (object && object.address) {
		return object.address.county;
	}
}

async function resolveName(name) {
	var results = [];
	const object = await getObjectFromUrl(`https://nume.ottomotor.ro/get_nume.json?zoom=7&nw_lat=49.5822260446217&nw_lng=23.88427734375&se_lat=42.18782901059085&se_lng=26.180419921875&search=${name}`);
	if (object && object.ani) {
		results = object.ani.map(async item => ({
			count: item.count,
			district: await resolveDistrict(item.area.centroid_lat, item.area.centroid_lng)
		}))
		.filter(item => item.district)
		.reduce((districts, item) => {
			const district = districts.find(i => i.name === item.district);
			if (district) {
				district.count += item.count;
			} else {
				districts.push({name: item.district, count: item.count});
			}
			return districts;
		}, [])
		.sort((first, second) =>
			first.count > second.count ? -1
			: (first.count < second.count ? 1 : 0));
	}
	return results;
}

module.exports = resolveName;