function router(routes) {
	const parts = {};
	Object.keys(routes)
		.forEach(route => parts[route] = route.split('/'));
	window.addEventListener('hashchange', event => {
		let index = event.newURL.indexOf('#');
		if (index > -1) {
			event.preventDefault();
			let location = event.newURL.substring(index + 1);
			let segments = location.split('/');
			let matches = Object.keys(routes)
				.filter(route => {
					if (parts[route].length !== segments.length) {
						return false;
					}
					for (let i = 0; i < segments.length; i++) {
						if (!parts[route][i].startsWith(':')
							&& parts[route][i] !== segments[i]) {
							return false;
						}
					}
					return true;
				});
			if (matches.length === 1) {
				let parameters = {};
				for (let i = 0; i < segments.length; i++) {
					if (parts[matches[0]][i].startsWith(':')) {
						parameters[parts[matches[0]][i].substring(1)] = segments[i];
					}
				}
				routes[matches[0]](parameters);
			}
		}
	});	
}
function goTo(path) {
	window.location.href = `#${path}`;
}
