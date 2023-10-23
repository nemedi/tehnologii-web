const {City, District} = require('./models');
const {from} = require('./workflow');

from('cities.json')
    .unmarshal('JSON')
    .split()
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
    .aggregate(() => true,
        (oldExchange, newExchange) => {
            let districts = oldExchange
                ? oldExchange.body : [];
            districts.push(newExchange.body);
            newExchange.body = districts;
            return oldExchange ? oldExchange : newExchange;
        }
    )
    .marshal('CSV')
    .to('districts.csv');