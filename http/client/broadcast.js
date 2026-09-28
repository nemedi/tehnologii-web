window.onload = event => {
    const handleMessage = message => {
        const list = document.querySelector('ul');
        const item = document.createElement('li');
        item.textContent = message;
        list.appendChild(item);
    };
    const socket = new WebSocket(window.location.origin.replace(/^http/, 'ws'));
    socket.onmessage = event => handleMessage(event.data);
    document.querySelector('input').onkeyup = event => {
        if (event.key === 'Enter'
            && event.target.value.trim().length > 0) {
            socket.send(event.target.value.trim());
            event.target.value = '';
        }
    };
};