window.onload = function() {
    spyOn(document.body, 'div',
        node => node.innerText = 'Jos Iliescu!');    
    document.querySelector('input[type="button"]').addEventListener('click', function(event) {
        const text = document.querySelector('input[type="text"]').value.trim();
        if (text.length > 0) {
            document.querySelector('p').innerHTML = `<div>${text}</div>`;
        }
    });
}