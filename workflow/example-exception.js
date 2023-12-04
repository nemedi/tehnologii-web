const {from, onException, run} = require('./workflow');

onException()
.log(exchange => exchange.body);
from(() => ['1', '2', '3', 'a', 'b', 'c'])
.split()
.process(exchange => exchange.body = parseInt(exchange.body))
.to('stream:out');
run();