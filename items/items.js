const {readFileSync, writeFileSync} = require('fs');
module.exports = function(path) {
	function loadItems(path) {
		return JSON.parse(readFileSync(path));
	}
	function storeItems(path, items) {
		writeFileSync(path, JSON.stringify(items));
	}
	const items = loadItems(path);
	var id = items.reduce((max, i) => i.id > max ? i.id : max, 0);
	return {
		getItems() {
			return items;
		},
		addItem(text) {
			const item = {id: ++id, text};
			items.push(item);
			storeItems(path, items);
			return item;
		},
		removeItem(id) {
			const index = items.findIndex(i => i.id === id);
			if (index > -1) {
				items.splice(index, 1);
				storeItems(path, items);
				return true;
			} else {
				return false;
			}
		}
	};
};