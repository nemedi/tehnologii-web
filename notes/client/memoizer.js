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