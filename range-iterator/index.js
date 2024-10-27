window.onload = function() {
    document.querySelector('input[type="button"]').addEventListener('click',  () => {
        let start = parseInt(document.querySelector('input[name="start"]').value.trim());
        let stop = parseInt(document.querySelector('input[name="stop"]').value.trim());
        let step = parseInt(document.querySelector('input[name="step"]').value.trim());
        const items = document.getElementById('items');
        items.innerHTML = '<ol>';
        for (let item of RangeIterator(start, stop, step)) {
            items.innerHTML += `<li>${item}</li>`;
        }
        items.innerHTML += '</ol>';
    });
}