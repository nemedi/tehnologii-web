class Exchange {

    static #count = 0;
    #id;
    #body;
    #headers = {};

    constructor(body) {
        this.#id = ++Exchange.#count;
        this.#body = body;
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

    run(exchanges) {
        throw Error('Method is not implemented.');
    }
}

class FromStep extends Step {
    
    #supplier;

    constructor(supplier) {
        super();
        this.#supplier = supplier;
    }

    run(exchanges) {
        return this.#supplier()
            .map(item => new Exchange(item));
    }
}

class AggregateStep extends Step {

    #criterion;
    #aggregator;

    constructor(creterion, aggregator) {
        super();
        this.#criterion = creterion;
        this.#aggregator = aggregator;
    }

    run(exchanges) {
        const map = new Map();
        exchanges.forEach(exchange => {
            const key = this.#criterion(exchange);
            map.set(key, this.#aggregator(map.get(key), exchange));
        });
        return new Array(...map.values());
    }
}

class FilterStep extends Step {

    #predicate;

    constructor(predicate) {
        super();
        this.#predicate = predicate;
    }

    run(exchanges) {
        return exchanges.filter(this.#predicate);
    }
}

class SortStep extends Step {

    #comparator;

    constructor(comparator) {
        super();
        this.#comparator = comparator;
    }

    run(exchanges) {
        return exchanges.sort(this.#comparator);
    }
}

class ProcessStep extends Step {

    #consumer;

    constructor(consumer) {
        super();
        this.#consumer = consumer;
    }

    run(exchanges) {
        exchanges.forEach(this.#consumer);
        return exchanges;
    }
    
}

class ToStep extends Step {

    #consumer;

    constructor(consumer) {
        super();
        this.#consumer = consumer;
    }

    run(exchanges) {
        this.#consumer(exchanges);
    }
}

class Flow {

    #steps = [];

    static from(supplier) {
        const flow = new Flow();
        flow.#steps.push(new FromStep(supplier));
        return flow;
    }

    filter(predicate) {
        this.#steps.push(new FilterStep(predicate));
        return this;
    }

    aggregate(criterion, aggregator) {
        this.#steps.push(new AggregateStep(criterion, aggregator));
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

    to(consumer) {
        this.#steps.push(new ToStep(consumer));
        let exchanges = [];
        for (let step of this.#steps) {
            exchanges = step.run(exchanges);
        }
    }
}

module.exports = Flow;