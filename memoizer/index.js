function memorizer(f) {
    const cache = {};
    return function() {
        if (cache[arguments] === undefined) {
            console.log(`calling f(${[...arguments]})`);
            cache[arguments] = f.apply(this, arguments);
        } else {
            console.log(`returning from cache f(${[...arguments]})`);
        }
        return cache[arguments];
    };
}

let fibonacci = n => n < 3 ? n : fibonacci(n - 2) + fibonacci(n - 1);
fibonacci = memorizer(fibonacci);
console.log('calling fibonacci(8)');
fibonacci(8);
console.log('done calling fibonacci(8)');
console.log('calling fibonacci(5)');
fibonacci(5);
console.log('done calling fibonacci(5)');