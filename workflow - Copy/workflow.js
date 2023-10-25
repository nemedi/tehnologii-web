const {readFileSync, writeFileSync} = require('fs');
class Exchange {
    static #count = 0;
    #id;
    #body;
    #headers;
    constructor(body, headers) {
        this.#id = ++Exchange.#count;
        this.#body = body;
        this.#headers = headers ? headers : {};
    }
    get id() {
        return this.#id;
    }
    get body() {
        return this.#body;
    }
    set body(body) {
        this.#body = body;
    }
    get headers() {
        return this.#headers;
    }
    split() {
        if (this.#body instanceof Array) {
            return this.#body.map(item => new Exchange(item, this.#headers));
        } else {
            return [this];
        }
    }
}
class Step {
    #handler;
    #exchanges;
    constructor(handler) {
        if (this.constructor.name === 'Step') {
            throw new Error('Cannot instantate abstract class Step.');
        }
        this.#handler = handler;
        this.#exchanges = [];
    }
    collect(exchange) {
        if (exchange instanceof Array) {
            this.#exchanges.push(...exchange);
        } else {
            this.#exchanges.push(exchange);
        }
    }
    get exchanges() {
        return this.#exchanges;
    }
    takeExchanges() {
        const exchanges = [...this.#exchanges];
        this.#exchanges = [];
        return exchanges;
    }
    run(exchange) {
        return this.#handler(exchange);
    }
}
class FromStep extends Step {
    constructor(endpoint) {
        super(() => {
            if (typeof endpoint === 'string') {
                const schema = endpoint.substring(0, endpoint.indexOf(':'));
                let path = endpoint.substring(endpoint.indexOf(':') + 1);
                switch (schema.toLowerCase()) {
                    case 'file':
                        this.collect(new Exchange(new String(readFileSync(path))));
                        return true;
                    default:
                        return false;
                }
            } else {
                this.collect(new Exchange(endpoint()));
                return true;
            }
        });
    }
}
class UnmarshalStep extends Step {
    constructor(dataType, RecordType) {
        super(exchange => {
            exchange.body = UnmarshalStep.#deserialize(exchange.body, dataType, RecordType);
            this.collect(exchange);
            return true;
        });
    }
    static #deserialize(data, dataType, RecordType) {
        switch (dataType.toUpperCase()) {
            case 'CSV':
                return data.split(/\n\r?/).map(line => new RecordType(line));
            case 'JSON':
                return JSON.parse(data);
            default:
                return {};
        }
    }
}
class SplitStep extends Step {
    constructor() {
        super(exchange => {
            this.collect(exchange.split());
            return true;
        });
    }
}
class FilterStep extends Step {
    constructor(predicate) {
        super(exchange => {
            if (predicate(exchange)) {
                this.collect(exchange);
            }
            return true;
        });
    }
}
class AggregateStep extends Step {
    #map = new Map();
    #count = 0;
    constructor(criterion, aggregator, complete) {
        super(exchange => {
            const key = criterion(exchange);
            this.#map.set(key, aggregator(this.#map.get(key), exchange));
            this.#count++;
            if (complete(Array.from(this.#map.values()), this.#count)) {
                this.collect(Array.from(this.#map.values()));
                this.#map = new Map();
                this.#count = 0;
                return true;
            } else {
                return false;
            }
        });
    }
}
class SortStep extends Step {
    #exchanges = [];
    constructor(comparator, complete) {
        super(exchange => {
            this.#exchanges.push(exchange);
            if (complete(this.#exchanges)) {
                this.collect(this.#exchanges.sort(comparator));
                this.#exchanges = [];
                return true;
            } else {
                return false;
            }
        });
    }
}
class ProcessStep extends Step {
    constructor(consumer) {
        super(exchange => {
            consumer(exchange);
            this.collect(exchange);
            return true;
        });
    }
}
class LogStep extends Step {
    constructor(logger) {
        super(exchange => {
            console.log(logger(exchange));
            this.collect(exchange);
            return true;
        });
    }
}
class MarshalStep extends Step {
    constructor(dataType, lineSeprator) {
        super(exchange => {
            exchange.body = MarshalStep.#serialize(exchange.body, dataType, lineSeprator);
            this.collect(exchange);
            return true;
        });
    }
    static #serialize(data, dataType, lineSeparator) {
        switch (dataType.toUpperCase()) {
            case 'CSV':
                return data.map(item => item.toCSV()).join(lineSeparator);
            case 'JSON':
                return JSON.stringify(data);
            default:
                return '';
        }
    }
}
class ToStep extends Step {
    constructor(endpoint) {
        super(exchange => {
            if (typeof endpoint === 'string') {
                const schema = endpoint.substring(0, endpoint.indexOf(':'));
                let path = endpoint.substring(endpoint.indexOf(':') + 1);
                switch (schema.toLowerCase()) {
                    case 'file':
                        writeFileSync(path, exchange.body);
                        return true;
                    case 'stream':
                        if (path.toLowerCase() === 'out') {
                            console.log(exchange.body.toString());
                            return true;
                        } else {
                            return false;
                        }
                    default:
                        return false;
                }
            } else {
                endpoint(exchange.body);
                return true;
            }
        });
    }
}
class Route {
    #steps;
    constructor(endpoint) {
        this.#steps = [new FromStep(endpoint)];
    }
    static from(endpoint) {
        return new Route(endpoint);
    }
    unmarshal(dataType, RecordType) {
        this.#steps.push(new UnmarshalStep(dataType, RecordType));
        return this;
    }
    split() {
        this.#steps.push(new SplitStep());
        return this;
    }
    filter(predicate) {
        this.#steps.push(new FilterStep(predicate));
        return this;
    }
    aggregate(criterion, aggregator, complete) {
        this.#steps.push(new AggregateStep(criterion, aggregator, complete));
        return this;
    }
    sort(comparator, complete) {
        this.#steps.push(new SortStep(comparator, complete));
        return this;
    }
    process(consumer) {
        this.#steps.push(new ProcessStep(consumer));
        return this;
    }
    log(logger) {
        this.#steps.push(new LogStep(logger));
        return this;
    }
    marshal(dataType, lineSeparator = '\n') {
        this.#steps.push(new MarshalStep(dataType, lineSeparator));
        return this;
    }
    to(endpoint) {
        this.#steps.push(new ToStep(endpoint));
        this.#run(this.#steps);
    }
    #run(steps) {
        let exchanges = [undefined];
        for (let step of steps) {
            let newExchanges = [];
            while (exchanges.length > 0) {
                while (!step.run(exchanges.shift())) {}
                let currentExchanges = step.takeExchanges();
                newExchanges.push(...currentExchanges);
            }
            exchanges = newExchanges;
        }
    }
}
module.exports = Route;