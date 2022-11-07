function startWorker() {
	if (typeof worker !== 'undefined') {
		worker.terminate();
		log(`Worker has been terminated.`);
	}
	worker = new Worker('loop.js');
	worker.onmessage = function (event) {
		delete worker;
		log(`Completed ${event.data} iterations.`);
	};
	worker.onerror = function (event) {
		delete worker;
		log(`Error: ${event.message}.`);
	};
	log('Worker started.');
}
function log(text) {
	document.getElementById('results').innerHTML += `<li>${text}</li>`;
}