const {from, run} = require('./workflow');

from(() => {
    let min = 1, max = 10;
    let numbers = [];
    for (let i = 0; i < 10; i++) {
        numbers.push(Math.floor(Math.random() * (max - min) + min));
    }
    return numbers;
})
.process(exchange => exchange.headers.count = exchange.body.length)
.split()
.resequence((first, second) => first.body - second.body,
    exchanges => exchanges[0].headers.count
)
.to('stream:out');
run();