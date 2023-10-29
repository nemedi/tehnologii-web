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
    set exchanges(exchanges) {
        this.#exchanges = exchanges;
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
    constructor(source) {
        super(() => {
            if (typeof source === 'string') {
                const schema = source.substring(0, source.indexOf(':'));
                let path = source.substring(source.indexOf(':') + 1);
                switch (schema.toLowerCase()) {
                    case 'file':
                        let exchange = new Exchange(new String(readFileSync(path)));
                        exchange.headers.path = path;
                        this.collect(exchange);
                        return true;
                    default:
                        return false;
                }
            } else {
                this.collect(new Exchange(source()));
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
            if (exchange.body instanceof Array) {
                this.collect(exchange.body.map(item => new Exchange(item, exchange.headers)));
            } else {
                this.collect([exchange]);
            }
            return true;
        });
    }
}

class FilterStep extends Step {
    constructor(predicate) {
        super(exchange => {
            if (predicate(exchange)) {
                this.collect(exchange);
                return true;
            } else {
                return false;
            }
        });
    }
}

class ContentFilterStep extends Step {
    constructor(predicate) {
        super(exchange => {
            if (exchange.body instanceof Array) {
                exchange.body = exchange.body.filter(predicate);
            }
            this.collect(exchange);
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

class ResequenceStep extends Step {
    constructor(comparator, size) {
        super(exchange => {
            this.collect(exchange);
            if (this.exchanges.length === size(this.exchanges)) {
                this.exchanges = this.exchanges.sort(comparator);
                return true;
            } else {
                return false;
            }
        });
    }
}

class SortStep extends Step {
    constructor(comparator) {
        super(exchange => {
            if (exchange.body instanceof Array) {
                exchange.body = exchange.body.sort(comparator);
            }
            this.collect(exchange);
            return true;
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
                return JSON.stringify(data, null, 2);
            default:
                return '';
        }
    }
}

class ToStep extends Step {
    constructor(target) {
        super(exchange => {
            if (typeof target === 'string') {
                const schema = target.substring(0, target.indexOf(':'));
                let path = target.substring(target.indexOf(':') + 1);
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
                target(exchange.body);
                return true;
            }
        });
    }
}

class ChoiceStep extends Step {
    #route;
    #whens = [];
    #otherwise;
    constructor(route) {
        super(exchange => {
            for (let when of this.#whens) {
                if (when.predicate(exchange)) {
                    this.exchanges = when.route.run(exchange);
                    return true;
                }
            }
            if (this.#otherwise) {
                this.exchanges = this.#otherwise.run(exchange);
            }
            return true;
        });
        this.#route = route;
    }
    when(predicate) {
        let route = new Route(this);
        this.#whens.push({predicate, route});
        return route;
    }
    otherwise() {
        this.#otherwise = new Route(this);
        return this.#otherwise;
    }
    done() {
        return this.#route;
    }
}

class Route {
    static #onException;
    #steps;
    #choiceStep;
    constructor(source) {
        if (source instanceof ChoiceStep) {
            this.#choiceStep = source;
            this.#steps = [];
        } else if (typeof source === 'string') {
            this.#steps = [new FromStep(source)];
        } else if (typeof source === 'function') {
            this.#steps = [new FromStep(source)];
        } else {
            this.#steps = [];
        }
    }
    static from(source) {
        return new Route(source);
    }
    static onException() {
        Route.#onException = new Route();
        return Route.#onException;
    }
    when(predicate) {
        return this.#choiceStep.when(predicate);
    }
    otherwise() {
        return this.#choiceStep.otherwise();
    }
    done() {
        return this.#choiceStep ? this.#choiceStep.done() : this;
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
    contentFilter(predicate) {
        this.#steps.push(new ContentFilterStep(predicate));
        return this;
    }    
    choice() {
        let choiceStep = new ChoiceStep(this);
        this.#steps.push(choiceStep);
        return choiceStep;
    }
    aggregate(criterion, aggregator, complete) {
        this.#steps.push(new AggregateStep(criterion, aggregator, complete));
        return this;
    }
    resequence(comparator, size) {
        this.#steps.push(new ResequenceStep(comparator, size));
        return this;
    }
    sort(comparator) {
        this.#steps.push(new SortStep(comparator));
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
        this.run();
    }
    run(exchange) {
        let exchanges = [exchange];
        for (let step of this.#steps) {
            try {
                let newExchanges = [];
                while (exchanges.length > 0) {
                    while (!step.run(exchanges.shift())) {}
                    let currentExchanges = step.takeExchanges();
                    newExchanges.push(...currentExchanges);
                }
                exchanges = newExchanges;
            } catch (error) {
                if (Route.#onException) {
                    Route.#onException.run(new Exchange(error));
                } else {
                    console.error(error);
                }
            }
        }
        return exchanges;
    }
}

module.exports = Route;