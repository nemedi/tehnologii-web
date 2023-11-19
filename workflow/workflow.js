const {readFileSync, writeFileSync, unlinkSync, watch, existsSync} = require('fs');
const {join} = require('path');

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
    #route;
    #exchanges;
    constructor(handler, route) {
        if (this.constructor.name === 'Step') {
            throw new Error('Cannot instantate abstract class Step.');
        }
        this.#handler = handler;
        this.#route = route;
        this.#exchanges = [];
    }
    get route() {
        return this.#route;
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
    log(message) {
        console.log(`[${this.constructor.name}: ${message}.]`);
    }
}

class FromStep extends Step {
    #source;
    #handler;
    constructor(source, route) {
        super(exchange => this.#handler(exchange), route);
        this.#source = source;
    }
    start() {
        if (typeof this.#source === 'string') {
            const schema = this.#source.substring(0, this.#source.indexOf(':'));
            const path = this.#source.substring(this.#source.indexOf(':') + 1);
            switch (schema.toLowerCase()) {
                case 'file':
                    this.#handler = exchange => {
                        exchange.body = new String(readFileSync(exchange.body));
                        exchange.headers.path = exchange.body;
                        this.collect(exchange);
                        return true;
                    };
                    this.log(`Watching folder '${path}'`);
                    watch(path, (eventType, fileName) => {
                        fileName = join(path, fileName);
                        if (eventType === 'change' && existsSync(fileName)) {
                            this.route.run(new Exchange(fileName));
                            unlinkSync(fileName);
                        }
                    });
                    break;
                default:
                    this.#handler = () => false;
            }
        } else {
            this.#handler = () => {
                this.collect(new Exchange(this.#source()));
                return true;
            };
        }
    }
}

class UnmarshalStep extends Step {
    constructor(dataType, RecordType, route) {
        super(exchange => {
            exchange.body = UnmarshalStep.#deserialize(exchange.body, dataType, RecordType);
            this.collect(exchange);
            return true;
        },  route);
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
    constructor(route) {
        super(exchange => {
            if (exchange.body instanceof Array) {
                this.collect(exchange.body.map(item => new Exchange(item, exchange.headers)));
            } else {
                this.collect([exchange]);
            }
            return true;
        }, route);
    }
}

class FilterStep extends Step {
    constructor(predicate, route) {
        super(exchange => {
            if (predicate(exchange)) {
                this.collect(exchange);
                return true;
            } else {
                return false;
            }
        }, route);
    }
}

class ContentFilterStep extends Step {
    constructor(predicate, route) {
        super(exchange => {
            if (exchange.body instanceof Array) {
                exchange.body = exchange.body.filter(predicate);
            }
            this.collect(exchange);
            return true;
        }, route);
    }
}

class AggregateStep extends Step {
    #map = new Map();
    #count = 0;
    constructor(criterion, aggregator, complete, route) {
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
        }, route);
    }
}

class ResequenceStep extends Step {
    constructor(comparator, size, route) {
        super(exchange => {
            this.collect(exchange);
            if (this.exchanges.length === size(this.exchanges)) {
                this.exchanges = this.exchanges.sort(comparator);
                return true;
            } else {
                return false;
            }
        }, route);
    }
}

class SortStep extends Step {
    constructor(comparator, route) {
        super(exchange => {
            if (exchange.body instanceof Array) {
                exchange.body = exchange.body.sort(comparator);
            }
            this.collect(exchange);
            return true;
        }, route);
    }
}

class ProcessStep extends Step {
    constructor(consumer,  route) {
        super(exchange => {
            consumer(exchange);
            this.collect(exchange);
            return true;
        }, route);
    }
}

class LogStep extends Step {
    constructor(logger, route) {
        super(exchange => {
            console.log(logger(exchange));
            this.collect(exchange);
            return true;
        }, route);
    }
}

class MarshalStep extends Step {
    constructor(dataType, lineSeprator, route) {
        super(exchange => {
            exchange.body = MarshalStep.#serialize(exchange.body, dataType, lineSeprator);
            this.collect(exchange);
            return true;
        }, route);
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
    constructor(target, route) {
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
        }, route);
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
        }, route);
    }
    when(predicate) {
        let route = new Route(this.route.routeBuilder, this);
        this.#whens.push({predicate, route});
        return route;
    }
    otherwise() {
        this.#otherwise = new Route(this.route.routeBuilder, this);
        return this.#otherwise;
    }
    done() {
        return this.route;
    }
}

class Route {
    #routeBuilder;
    #steps;
    #choiceStep;
    constructor(routeBuilder, source) {
        this.#routeBuilder = routeBuilder;
        if (source instanceof ChoiceStep) {
            this.#choiceStep = source;
            this.#steps = [];
        } else if (typeof source === 'string') {
            this.#steps = [new FromStep(source, this)];
        } else if (typeof source === 'function') {
            this.#steps = [new FromStep(source, this)];
        } else {
            this.#steps = [];
        }
    }
    get routeBuilder() {
        return this.#routeBuilder;
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
        this.#steps.push(new UnmarshalStep(dataType, RecordType, this));
        return this;
    }
    split() {
        this.#steps.push(new SplitStep(this));
        return this;
    }
    filter(predicate) {
        this.#steps.push(new FilterStep(predicate, this));
        return this;
    }
    contentFilter(predicate) {
        this.#steps.push(new ContentFilterStep(predicate, this));
        return this;
    }    
    choice() {
        let choiceStep = new ChoiceStep(this);
        this.#steps.push(choiceStep);
        return choiceStep;
    }
    aggregate(criterion, aggregator, complete) {
        this.#steps.push(new AggregateStep(criterion, aggregator, complete, this));
        return this;
    }
    resequence(comparator, size) {
        this.#steps.push(new ResequenceStep(comparator, size, this));
        return this;
    }
    sort(comparator) {
        this.#steps.push(new SortStep(comparator, this));
        return this;
    }
    process(consumer) {
        this.#steps.push(new ProcessStep(consumer, this));
        return this;
    }
    log(logger) {
        this.#steps.push(new LogStep(logger, this));
        return this;
    }
    marshal(dataType, lineSeparator = '\n') {
        this.#steps.push(new MarshalStep(dataType, lineSeparator, this));
        return this;
    }
    to(endpoint) {
        this.#steps.push(new ToStep(endpoint, this));
    }
    start() {
        this.#steps[0].start();
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
                if (RouteBuilder.onException) {
                    RouteBuilder.onException.run(new Exchange(error));
                } else {
                    console.error(error);
                }
            }
        }
        return exchanges;
    }
}

class RouteBuilder {
    static #routes = [];
    static #onException;
    configure() {
    }
    static from(source) {
        const route = new Route(this, source);
        RouteBuilder.#routes.push(route);
        return route;
    }
    static onException() {
        RouteBuilder.#onException = new Route(this);
        return RouteBuilder.#onException;
    }
    get onException() {
        return RouteBuilder.#onException;
    }
    static run() {
        RouteBuilder.#routes.forEach(route => route.start());
    }
}

module.exports = RouteBuilder;