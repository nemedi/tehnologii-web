function* sieveOfEratosthenes(limit = 100) {
    var isPrime = new Array(parseInt(limit) + 1).fill(true);
    var nextPrimeNumber = 2;
    while (nextPrimeNumber <= limit) {
        let number = nextPrimeNumber;
        nextPrimeNumber++;
        for (let i = nextPrimeNumber; i < isPrime.length; i++) {
			if (i % number == 0) {
				isPrime[i] = false;
			}
		}
		while (nextPrimeNumber < isPrime.length && isPrime[nextPrimeNumber] === false) {
			nextPrimeNumber++;
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