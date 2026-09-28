function printCollection(title, collection) {
    let output = `<p><h1>${title}</h1>`;
    output += '<ul>';
    for (const [key, value] of Object.entries(collection)) {
        output += `<li>${key}: ${value}</li>`;
    }
    output += '</ul></p>';
    return output;
}

module.exports = {printCollection};