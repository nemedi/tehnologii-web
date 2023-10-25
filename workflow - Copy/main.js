const {City, District} = require('./models');
const {from} = require('./workflow');

from('file:cities.csv')
    .unmarshal('CSV', City)
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
        exchanges => exchanges.length === exchanges[0].headers.count)
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