function memoizer(f) {
    const cache = {};
    return function() {
        const key = [...arguments].toString();
        if (cache[key] === undefined) {
            console.log(`+ calling f(${key})`);
            cache[key] = f.apply(this, arguments);
        } else {
            console.log(`+  returning from cache f(${key})`);
        }
        return cache[key];
    };
}

let fibonacci = n => n < 3 ? n : fibonacci(n - 2) + fibonacci(n - 1);
fibonacci = memoizer(fibonacci);
console.log('calling fibonacci(8)');
console.log(`fibonacci(${fibonacci(8)})`);
console.log('done calling fibonacci(8)');
console.log('calling fibonacci(5)');
console.log(fibonacci(5));
console.log('done calling fibonacci(5)');