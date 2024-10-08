const {from} = require('./route-engine');

from(() => [1, 2, 3, 4])
.split()
.choice()
    .when(exchange => exchange.body % 2 === 0)
        .process(exchange => exchange.body = 'a')
    .otherwise()
        .process(exchange => exchange.body = 'b')
.done()
.to('stream:out');