function Stream(seed, nextValue) {
	var initialValue = seed;
	var value = initialValue;
	this.next = function() {
		value = nextValue(value);
		return value;
	}
	this.value = function() {
		return value;
	}
	this.reset = function() {
		value = initialValue;
	}
	Stream.count++;
}

function ConstantStream(value) {
	Stream.call(this, value, currentValue => value);
}
ConstantStream.prototype = Object.create(Stream.prototype);

function NextIntegerStream() {
	Stream.call(this, 0, value => value + 1);
}
NextIntegerStream.prototype = Object.create(Stream.prototype);

function NextEvenIntegerStream() {
	Stream.call(this, 0, value => value + 2);
}
NextEvenIntegerStream.prototype = Object.create(Stream.prototype);

function FibonacciStream() {
	var firstValue = 0;
	var secondValue = 1;
	Stream.call(this, 0, value => {
		value = firstValue;
		firstValue = secondValue;
		return secondValue += value;
	});
	this.reset = function() {
		firstValue = 0;
		secondValue = 1;
	};
}
FibonacciStream.prototype = Object.create(Stream.prototype);

const constant = new ConstantStream(1);
const nextInteger = new NextIntegerStream();
const nextEvenInteger = new NextEvenIntegerStream();
const fibonacci = new FibonacciStream();
for (let i = 1; i <= 10; i++) {
	console.log(`constant[${i}] = ${constant.next()}`);
	console.log(`nextInteger[${i}] = ${nextInteger.next()}`);
	console.log(`nextEvenInteger[${i}] = ${nextEvenInteger.next()}`);
	console.log(`fibonacci[${i}] = ${fibonacci.next()}`);
}
