function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
String.prototype.render = function(context) {
    function getValue(context, path) {
        let segments = path.split('/');
        let scopes = context instanceof Array ? context : [context];
        let index;
        for (index = 0; index < segments.length; index++) {
            if (segments[index] !== '..') {
                break;
            }
        }
        let scope = index < scopes.length
            ? scopes[index] : context;
        let value = scope[segments[index]];
        return value != undefined ? value : '';
    }
    function mergeScopes(context, element, index) {
        let scope = {...element};
        if (index  !== undefined) {
            scope = {...scope, index};
        }
        if (context instanceof Array) {
            return [scope, ...context];
        } else {
            return [scope, context];
        }
    }
    let result = this.replace(/#{([^}]+)}([^]*)#{\/\1}/g, (match, key, template) =>
            getValue(context, key) instanceof Array
                ? getValue(context, key).map((element, index) => template.render(mergeScopes(context, element, index))).join('')
                : (getValue(context, key) ? template.render(mergeScopes(context, getValue(context, key))) : template)
        );
    result = result.replace(/\?{([^}]+)}([^]*)\?{\/\1}/g, (match, key, template) =>
        context[key] === true ? template.render(context) : ''
    );
    result = result.replace(/\${([^}]+)}/g, (match, path) => getValue(context, path));
    result = result.replace(/\${[^}]+}/g, '');
    result = result.replace(/%{([^}]+)}/g, (match, expression) => eval(expression));
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