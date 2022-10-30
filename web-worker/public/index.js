state = 'unknown';
function startWorker() {
	if (state === 'running') {
		worker.terminate();
		state = 'terminated';
		log(`<li>Worker has been terminated.</li>`);
	}
	worker = new Worker('loop.js');
	worker.onmessage = function (event) {
		state = 'done';
		log(`<li>Completed ${event.data} iterations.</li>`);
	};
	worker.onerror = function (event) {
		state = 'failed';
		log(`<li>Error: ${event.message}.</li>`);
	};
	state = 'running';
	log('<li>Worker started.</li>');
}
function log(text) {
	document.getElementById('results').innerHTML += text;
}