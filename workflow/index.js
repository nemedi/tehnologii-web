const {City, District} = require('./models');
const CSV = require('./csv');
const {from} = require('./workflow');

from(() => CSV.load('cities.csv', City))
    .filter(exchange => exchange.body.district)
    .aggregate(exchange => exchange.body.district,
        (oldExchange, newExchange) => {
            let district = oldExchange
                ? oldExchange.body
                : new District(newExchange.body.district);
            district.addCity(newExchange.body);
            newExchange.body = district;
            return oldExchange ? oldExchange : newExchange;
        }
    )
    .sort((first, second) => first.body.name.localeCompare(second.body.name))
    .process(exchange => console.log(exchange.body.toString()))
    .to(exchanges => CSV.store('districts.csv', exchanges.map(exchange => exchange.body)));