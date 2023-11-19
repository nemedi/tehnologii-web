window.onload = async function() {
    const response = await fetch('/tasks');
    const body = await response.json();
    document.getElementById('container').tasks(body);
}
