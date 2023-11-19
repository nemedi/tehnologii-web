function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
String.prototype.render = function(context) {
	return Object.entries(context).reduce((result, [key, value]) =>
		result.replaceAll('${' + key + '}', value), this);
}