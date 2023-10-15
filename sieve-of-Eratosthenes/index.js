function* sieveOfEratosthenes(limit = 100) {
    var numbers = new Array(parseInt(limit) + 1).fill(0);
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

function showPrimeNumbers() {
    const limit = document.getElementById('limit').value;
    const numbersTag = document.getElementById('numbers');
    numbersTag.innerHTML = '';
    const generator = sieveOfEratosthenes(limit);
    for (let result = generator.next(); !result.done; result = generator.next()) {
        numbersTag.innerHTML += `<li>${result.value}</li>`;
    }
}