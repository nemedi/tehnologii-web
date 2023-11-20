function router(routes) {
	const parts = {};
	Object.keys(routes)
		.forEach(route => parts[route] = route.split('/'));
	function handleNavigate(hash) {
		let segments = hash.split('/');
		let matchingRoutes = Object.keys(routes)
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
		if (matchingRoutes.length === 1) {
			let matchingRoute = matchingRoutes[0];
			let parameters = {};
			for (let i = 0; i < segments.length; i++) {
				if (parts[matchingRoute][i].startsWith(':')) {
					parameters[parts[matchingRoute][i].substring(1)] = segments[i];
				}
			}
			routes[matchingRoute](parameters);
		}
	}
	window.addEventListener('load', event => {
		if (location.hash.startsWith('#')) {
			event.preventDefault();
			handleNavigate(location.hash.substring(1));
		}
	});
	window.addEventListener('hashchange', event => {
		let index = event.newURL.indexOf('#');
		if (index > -1) {
			event.preventDefault();
			handleNavigate(event.newURL.substring(index + 1));
		}
	});	
}
function goTo(path) {
	location.href = `#${path}`;
}
