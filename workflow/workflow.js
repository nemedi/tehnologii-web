const {readFileSync, writeFileSync} = require('fs');
class Exchange {
    static #count = 0;
    #id;
    #body;
    #headers;
    constructor(body, headers) {
        this.#id = ++Exchange.#count;
        this.#body = body;
        this.#headers = headers ? headers : new Map();
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
    constructor(path) {
        super(() => [new Exchange(new String(readFileSync(path)))]);
    }
}
class UnmarshalStep extends Step {
    constructor(dataType, RecordType) {
        super(exchanges => {
            exchanges.forEach(exchange =>
                exchange.body = UnmarshalStep.#deserialize(exchange.body, dataType, RecordType));
            return exchanges;
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
        super(exchanges => exchanges.flatMap(exchange => exchange.split()));
    }
}
class FilterStep extends Step {
    constructor(predicate) {
        super(exchanges => exchanges.filter(predicate));
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
class MarshalStep extends Step {
    constructor(dataType, lineSeprator) {
        super(exchanges => {
            exchanges.forEach(exchange =>
                exchange.body = MarshalStep.#serialize(exchange.body, dataType, lineSeprator));
            return exchanges;
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
    constructor(path) {
        super(exchanges => writeFileSync(path, exchanges[0].body));
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
    marshal(dataType, lineSeparator = '\n') {
        this.#steps.push(new MarshalStep(dataType, lineSeparator));
        return this;
    }
    to(path) {
        this.#steps.push(new ToStep(path));
        let exchanges = [];
        for (let step of this.#steps) {
            exchanges = step.run(exchanges);
        }
    }
}
module.exports = Flow;