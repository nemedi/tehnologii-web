const fetch = require('node-fetch');

module.exports = async function(url) {
	try {
		if (!url.startsWith("http://"
			&& !url.startsWith("https://"))) {
				url = "http://" + url;
			}
		const response = await fetch(url);
		const body = await response.text();
		return [...body.matchAll(/href=\"([^\"]*?)\"/g)]
			.map(result => {
				let link = result[1];
				if (link.startsWith('?')) {
					link = url + link;
				} else {
					let basePath = url.substring(0, url.indexOf(0, url.indexOf('://' + 3)));
					if (basePath.length === 0) {
						basePath = url;
					}
					if (link.startsWith("/")) {
						link = basePath + link;
					}
				}
				return link;
			})
			.filter(link => link.length > 0
				&& !link.startsWith('javascript:')
				&& !link.startsWith('mailto:')
				&& !link.startsWith('#'))
			.sort((first, second) => first.localeCompare(second))
			.filter((link, index, links) =>
				index === 0 || index > 0 && link !== links[index - 1]);
	} catch (error) {
		return [];
	}
}