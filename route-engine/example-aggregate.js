const {City, District} = require('./models');
const {from} = require('./route-engine');

from('file:data/in/cities.csv')
.choice()
    .when(exchange => exchange.headers.path.toLowerCase().endsWith('.csv'))
        .unmarshal('CSV', City)
    .when(exchange => exchange.headers.path.toLowerCase().endsWith('.json'))
        .unmarshal('JSON')
    .otherwise()
        .process(exchange => exchange.body = [])
.done()
.contentFilter(city => city.district)
.process(exchange => exchange.headers.count = exchange.body.length)
.split()
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
.resequence((first, second) => first.body.name.localeCompare(second.body.name),
    exchanges => exchanges[0].headers.count
)
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
.sort((first, second) => first.name.localeCompare(second.name))
.marshal('CSV')
.to('file:data/out/districts.csv');