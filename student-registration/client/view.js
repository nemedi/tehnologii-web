function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
String.prototype.render = function(context) {
	return Object.entries(context).reduce((result, [key, value]) =>
		result.replaceAll('${' + key + '}', value), this)
		.replace(/%{([^}]*)}/g, (match, expression) => eval(expression));
}
function memoizer(method) {
    const cache = {};
    return function() {
        const key = [...arguments].toString();
        if (cache[key] === undefined) {
            cache[key] = method.apply(this, arguments);
        }
        return cache[key];
    };
}
const getView = memoizer(async view =>
	await (await fetch(`/views/${view}.html`)).text()
);