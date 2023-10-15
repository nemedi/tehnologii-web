function* sieveOfEratosthenes(limit = 100) {
    var numbers = new Array(limit + 1).fill(0);
    var index = 2;
    while (index <= limit) {
        let number = index;
        index++;
        for (let i = index; i < numbers.length; i++) {
			if (i % number == 0) {
				numbers[i] = 1;
			}
		}
		while (index < numbers.length && numbers[index] == 1) {
			index++;
		}
		yield number;
    }
}

const generator = sieveOfEratosthenes();
for (let i = 0; i < 10; i++) {
    console.log(generator.next().value);
}