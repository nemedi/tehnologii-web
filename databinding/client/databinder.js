const DataBinder = function() {
    
    window.onload = function() {
        let elements = document.querySelector('input[databinding]');
        if (elements && elements.length > 0) {
            for (let element of elements) {
                let propertyName = element.getAttribute('databinding');
                element.value = data[propertyName];
                element.addEventListener('change', function() {
                    data[propertyName] = element.value;
                });
            }
        }
    };
};
