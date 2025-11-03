$ = (id) => document.getElementById(id);
window.onload = function() {
    const onButtonClicked = event => {
        console.log('Button was clicked.');
        if ($('stopPropagation').checked) {
            event.stopPropagation();
        }
    };
    const onWindowClicked = event => {
        console.log('Window received the click event.');
    };
    const onContainerClicked = event => {
        console.log('Container received the click event.');
    };
    $('myButton').addEventListener('click', onButtonClicked);
    window.addEventListener('click', onWindowClicked, $('capture').checked);
    $('container').addEventListener('click', onContainerClicked, $('capture').checked);
    $('capture').addEventListener('change', event => {
        window.removeEventListener('click', onWindowClicked);
        $('container').removeEventListener('click', onContainerClicked);
        window.addEventListener('click', onWindowClicked, event.target.checked);
        $('container').addEventListener('click', onContainerClicked, event.target.checked);
    });
};