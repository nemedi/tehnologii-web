class Exchange {
    static #count = 0;
    #id;
    #body;
    #headers;
    constructor(body) {
        this.#id = ++Exchange.#count;
        this.#body = body;
        this.#headers = new Map();
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
    constructor(handler) {
        if (this.constructor.name === 'Step') {
            throw new Error('Cannot instantate abstract class Step.');
        }
        this.#handler = handler;
    }
    run(exchanges) {
        console.log(`[ ${this.constructor.name}.run::begin ]`);
        exchanges = this.#handler(exchanges);
        console.log(`[ ${this.constructor.name}.run::end ]`);
        return exchanges;
    }
}

class FromStep extends Step {
    constructor(supplier) {
        super(() => supplier().map(item => new Exchange(item)));
    }
}

class AggregateStep extends Step {
    constructor(criterion, aggregator) {
        super(exchanges => {
            const map = new Map();
            exchanges.forEach(exchange => {
                const key = criterion(exchange);
                map.set(key, aggregator(map.get(key), exchange));
            });
            return new Array(...map.values());            
        });
    }
}

class FilterStep extends Step {
    constructor(predicate) {
        super(exchanges => exchanges.filter(predicate));
    }
}

class SortStep extends Step {
    constructor(comparator) {
        super(exchanges => exchanges.sort(comparator));
    }
}

class ProcessStep extends Step {
    constructor(consumer) {
        super(exchanges => {
            exchanges.forEach(consumer);
            return exchanges;
        });
    }
}

class ToStep extends Step {
    constructor(consumer) {
        super(exchanges => consumer(exchanges));
    }
}

class Flow {
    #steps;
    constructor() {
        this.#steps = [];
    }
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