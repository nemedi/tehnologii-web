const {City, District} = require('./models');
const {from} = require('./workflow');

function run()  {
    for (let example of arguments) {
        console.log(`[${example.name}#begin]`);
        example();
        console.log(`[${example.name}#end]`);
    }
}

function aggregateExample() {
    from('file:cities.csv')
    .choice()
        .when(exchange => exchange.headers.path.toLowerCase().endsWith('.csv'))
            .unmarshal('CSV', City)
        .when(exchange => exchange.headers.path.toLowerCase().endsWith('.json'))
            .unmarshal('JSON')
        .otherwise()
            .process(exchange => exchange.body = [])
    .done()
    .process(exchange => exchange.headers.count = exchange.body.length)
    .split()
    .filter(exchange => {
        if (exchange.body.district) {
            return true;
        } else {
            exchange.headers.count--;
            return false;
        }
    })
    .aggregate(exchange => exchange.body.district,
        (oldExchange, newExchange) => {
            let district = oldExchange
                ? oldExchange.body
                : new District(newExchange.body.district);
            district.addCity(newExchange.body);
            newExchange.body = district;
            return oldExchange ? oldExchange : newExchange;
        },
        (exchanges, count) => {
            if (count === exchanges[0].headers.count) {
                exchanges.forEach(exchange => exchange.headers.count = exchanges.length);
                return true;
            } else {
                return false;
            }
        }
    )
    .sort((first, second) => first.body.name.localeCompare(second.body.name),
        exchanges => exchanges[0].headers.count)
    .log(exchange => exchange.body.toString())
    .aggregate(() => true,
        (oldExchange, newExchange) => {
            let districts = oldExchange
                ? oldExchange.body : [];
            districts.push(newExchange.body);
            newExchange.body = districts;
            return oldExchange ? oldExchange : newExchange;
        },
        (exchanges, count) => count === exchanges[0].headers.count
    )
    .marshal('CSV')
    .to('file:districts.csv');
}

function choiceExample() {
    from(() => [1, 2, 3, 4])
    .split()
    .choice()
        .when(exchange => exchange.body % 2 === 0)
            .process(exchange => exchange.body = 'a')
        .otherwise()
            .process(exchange => exchange.body = 'b')
    .done()
    .to('stream:out');
}

function sortExample() {
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
    .sort((first, second) => first.body - second.body,
        exchanges => exchanges[0].headers.count
    )
    .to('stream:out');
}

run(choiceExample, sortExample, aggregateExample);