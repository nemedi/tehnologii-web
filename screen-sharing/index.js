function $(selector) {
    return document.querySelector(selector);
}
window.addEventListener('load', () => {
    $('#run').addEventListener("click", async event => {
        try {
            if (event.target.value === 'Start') {
                $('#player').srcObject =
                    await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            cursor: "always",
                            width: $('#width').value,
                            height: $('#height').value
                        },
                        audio: false
                    });
                event.target.value = 'Stop';
            } else {
                let tracks = $('#player').srcObject.getTracks();
                tracks.forEach(track => track.stop());
                $('#player').srcObject = null;
                event.target.value = 'Start';
            }
        } catch (error) {
            console.error("Error: " + error.message);
        }
    });
});
