async function resolveDistrict(latitude, longitude) {
	try {
		const endpoint = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ro`;
		const response = await fetch(endpoint, {headers: {'User-Agent': 'search-romanian-names'}});
		const body = await response.json();
		return body
			&& body.countryName === 'România'
			? body.principalSubdivision
			: undefined;
	} catch (error) {
		return "";
	}
}
async function searchName(name) {
	try {
		const endpoint = `https://nume.ottomotor.ro/get_nume.json?zoom=7&nw_lat=49.5822260446217&nw_lng=19.423828125000004&se_lat=42.18782901059085&se_lng=30.662841796875004&search=${name}`;
		const response = await fetch(endpoint, {headers: {'User-Agent': 'search-romanian-names'}});
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