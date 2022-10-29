HTMLElement.prototype.menu = function(items) {
	this.innerHTML = '<ul>'
		+ Object.entries(items).map(([label, handler]) => {
			if (typeof handler === 'string') {
				return `<li>
							<a href="${handler}">${label}</a>
						</li>`;
			} else if (typeof handler === 'function') {
				return `<li>
							<a href="javascript:(${handler})('${label}')">${label}</a>
						</li>`;
			} else if (typeof handler === 'object') {
				return `<li class="dropdown">
							<a href="javascript:void(0)">${label}</a>
							<div class="dropdown-content">`
						+ Object.entries(handler).map(([label, handler]) => {
							if (typeof handler === 'string') {
								return `<a href="${handler}">${label}</a>`;
							} else if (typeof handler === 'function') {
								return `<a href="javascript:(${handler})('${label}')">${label}</a>`
							} else {
								return '';
							}
						})
						.reduce((html, item) => html += item, '')
						+ `</div>
							</li>`;
			} else {
				return '';
			}
		})
		.reduce((html, item) => html += item, '')
		+ '</ul>';
}

function loadMenu(id) {
	document.getElementById(id)
		.menu({
			'Home': '#',
			'News': '#',
			'Dropdown 1': {
				"Link 1-1": (item) => alert(item),
				"Link 1-2": "#",
				"Link 1-3": "#"
			},
			'Dropdown 2': {
				"Link 2-1": "#",
				"Link 2-2": "#",
				"Link 2-3": "#"
			}
		});
}