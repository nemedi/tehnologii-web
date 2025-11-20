const {readFileSync, writeFileSync} = require('fs');

module.exports = function(path) {
	function load(path) {
		return JSON.parse(readFileSync(path));
	}
	function store(path, data) {
		writeFileSync(path, JSON.stringify(data));
	}
	const data = load(path);
	var nextId = Object.values(data).reduce((maximum, items) =>
		items.reduce((currentMaximum, item) =>
			currentMaximum < item.id ? item.id : currentMaximum,
		maximum),
	0);
	function getModel(model) {
		return data[model];
	}
	function saveModel(model, item) {
		if (item.id) {
			let index = data[model].findIndex(i => i.id === item.id);
			if (index > -1) {
				data[model][index] = item;
				store(path, data);
				return true;
			} else {
				return false;
			}
		} else {
			item.id = ++nextId;
			data[model].push(item);
			store(path, data);
			return true;
		}
	}
	function removeModel(model, id) {
		const index = data[model].findIndex(i => i.id === id);
		if (index > -1) {
			data[model].splice(index, 1);
			store(path, data);
			return true;
		} else {
			return false;
		}
	}
	return {
		getModel,
		saveModel,
		removeModel
	};
};