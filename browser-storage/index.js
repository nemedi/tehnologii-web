if (sessionStorage.hits) {
	sessionStorage.hits = Number(sessionStorage.hits) + 1;
} else {
	sessionStorage.hits = 1;
}
document.write(`<p>Total session-storage hits: ${sessionStorage.hits}.<p>`);

if (localStorage.hits) {
	localStorage.hits = Number(localStorage.hits) + 1;
} else {
	localStorage.hits = 1;
}
document.write(`<p>Total local-storage hits: ${localStorage.hits}.</p>`);