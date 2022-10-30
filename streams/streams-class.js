class Stream {
	#value;
	#initialValue;
	#nextValue;
	static #count = 0;
	constructor(value, nextValue) {
		this.#value = this.#initialValue = value;
		this.#nextValue = nextValue;
		Stream.#count++;
	}
	get next() {
		this.#value = this.#nextValue(this.#value);
		return this.#value;
	}
	get value() {
		return this.#value;
	}
	static get count() {
		return Stream.#count;
	}
	reset() {
		this.#value = this.#initialValue;
	}
}

class ConstantStream extends Stream {
	constructor(value) {
		super(value, value => value);
	}
}

class NextIntegerStream extends Stream {
	constructor() {
		super(0, value => value + 1);
	}
}

class NextEvenIntegerStream extends Stream {
	constructor() {
		super(0, value => value + 2);
	}
}

class FibonacciStream extends Stream {
	#firstValue = 0;
	#secondValue = 1;
	constructor() {
		super(0, value => {
			value = this.#firstValue;
			this.#firstValue = this.#secondValue;
			return this.#secondValue += value;
		});
	}
	reset() {
		this.#firstValue = 0;
		this.#secondValue = 1;
	}
}

const constant = new ConstantStream(1);
const nextInteger = new NextIntegerStream();
const nextEvenInteger = new NextEvenIntegerStream();
const fibonacci = new FibonacciStream();
for (let i = 1; i <= 10; i++) {
	if (i == 6) {
		constant.reset();
		nextInteger.reset();
		fibonacci.reset();
	}
	console.log(`constant[${i}] = ${constant.next}`);
	console.log(`nextInteger[${i}] = ${nextInteger.next}`);
	console.log(`nextEvenInteger[${i}] = ${nextEvenInteger.next}`);
	console.log(`fibonacci[${i}] = ${fibonacci.next}`);
}
console.log(Stream.count);
