function currying(f) {
    return function curried(...args1) {
        if (args1.length >= f.length) {
            return f.apply(this, args1);
        } else {
            return function(...args2) {
                return curried.apply(this, args1.concat(args2));
            }
        }
    }
}

function log(date, level, message) {
    console.log(`[${date.toJSON()}][${level}]: ${message}`);
}

const curriedLog = currying(log);
const logNow = curriedLog(new Date());
const logErrorNow = logNow('ERROR');

try {
    throw new Error('Something went wrong.');
} catch (error) {
    logErrorNow(error.message);
}