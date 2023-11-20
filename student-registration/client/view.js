function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
String.prototype.render = function(context) {
    let result = this.replace(/#{([^}]+)}([^]*)#{\/\1}/g, (match, key, template) =>
            context[key] instanceof Array
                ? context[key].map(element => template.render(element)).join('')
                : (context[key] ? template.render(context[key]) : template)
        );
    result = result.replace(/\?{([^}]+)}([^]*)\?{\/\1}/g, (match, key, template) =>
        context[key] === true ? template : ''
    );
    result = Object.entries(context)
        .filter(([key, value]) => !(value instanceof Array))
        .reduce((text, [key, value]) =>
            text.replaceAll('${' + key + '}', value), result);
    result = result.replace(/\${[^}]+}/g, '');
    result = result.replace(/%{([^}]+)}/g, (match, expression) => {
        console.log(expression);
        eval(expression);
    });
    
    return result;
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