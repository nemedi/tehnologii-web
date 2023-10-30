const {readFileSync, writeFileSync,  existsSync} = require('fs');
module.exports = function(path) {
    function loadItems(path) {
        if (existsSync(path)) {
            return JSON.parse(readFileSync(path));    
        } else {
            return [];
        }
    }
    function storeItems(items, path) {
        writeFileSync(path, JSON.stringify(items));
    }
    const items = loadItems(path);
    var id = items.reduce((max, i) => i.id > max ? i.id : max, 0);
    return {
        getItems() {
            return items;
        },
        addItem(text) {
            const item = {id: ++id, text};
            items.push(item);
            storeItems(items, path);
            return item;
        },
        removeItem(id) {
            const index = items.findIndex(i => i.id === id);
            if (index > -1) {
                items.splice(index, 1);
                storeItems(items, path);
                return true;
            } else {
                return false;
            }
        }
    };
};