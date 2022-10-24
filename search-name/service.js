const fetch = require('node-fetch');

async function resolveDistrict(latitude, longitude) {
	const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
	const body = await response.json();
	return body && body.address && body.address.country === 'România'
		? body.address.county
		: undefined;
}

async function searchName(name) {
	try {
		const response = await fetch(`https://nume.ottomotor.ro/get_nume.json?zoom=7&nw_lat=49.5822260446217&nw_lng=19.423828125000004&se_lat=42.18782901059085&se_lng=30.662841796875004&search=${name}`);
		const body = await response.json();
		if (body && body.ani) {
			const results = [];
			for (var item of body.ani) {
				const district = await resolveDistrict(item.area.centroid_lat, item.area.centroid_lng);
				if (district) {
					results.push({
						count: item.count,
						district: district
					});
				}
			}
			return results
				.reduce((items, item) => {
					const district = items.find(i => i.district === item.district);
					if (district) {
						district.count += item.count;
					} else {
						items.push({district: item.district, count: item.count});
					}
					return items;
				}, [])
				.sort((first, second) =>
					first.count > second.count ? -1
					: (first.count < second.count ? 1 : 0));
		} else {
			return [];
		}
	} catch (error) {
		return [];
	}
}

module.exports = searchName;