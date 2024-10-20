function set(element, property, value) {
    let parts = property.split('.');
    let container = element;
    for (let i = 0; i < parts.length - 1; i++) {
        container = container[parts[i]];
    }
    container[parts[parts.length - 1]] = value;
}

function create(tag, options, ...children) {
    const element = document.createElement(tag);
    if (options) {
        Object.entries(options).forEach(([property, value]) => set(element, property, value));
    }
    if (children) {
        children.forEach(child => element.appendChild(child));
    }
    return element;
}

HTMLElement.prototype.catalog = async function({getProducts}) {
    this.innerHTML = '';
    const products = await getProducts();
    async function onAddCartItem(event) {
        const product = products.find(product => product.id === event.target.data);
        if (product) {
            const item = {id: product.id, product: product.title, units: 1, unitPrice: product.price};
            const addCartItemEvent = new Event('addCartItem');
            addCartItemEvent.item = item;
            window.dispatchEvent(addCartItemEvent);
        }
    }
    this.appendChild(create('p', {},
        ...products.map(product =>
            create('p', {},
                create('div', {},
                    create('b', {innerText: product.title})
                ),
                create('div', {},
                    create('i', {innerText: product.description})
                ),
                create('div', {},
                    create('img', {src: product.image, width: 100, height: 100})
                ),
                create('div', {},
                    create('span', {innerText: 'Rating: '}),
                    create('span', {innerText: product.rating.rate}),
                    create('span', {innerText: ' out of '}),
                    create('span', {innerText: product.rating.count})
                ),
                create('div', {},
                    create('span', {innerText: 'Price:'}),
                    create('span', {innerText: product.price + '$'})
                ),
                create('div', {},
                    create('button', {innerText: 'Order', data: product.id, onclick: onAddCartItem})
                )
            )
        )
    ));
};

HTMLElement.prototype.cart = async function({getCartItems, incrementCartItem, decrementCartItem, addCartItem}) {
    this.innerHTML = '';
    async function onIncrementCartItem(event) {
        await incrementCartItem(event.target.data);
    }
    async function onDecrementCartItem(event) {
        await decrementCartItem(event.target.data);
    }
    async function onAddCartItem(event) {
        await addCartItem(event.item);
        const entryElement = getEntryElement(event.item.id);
        if (entryElement) {
            entryElement.children[2].innerText = parseInt(entryElement.children[2].innerText) + 1;
        } else {
            tableElement.insertBefore(
                createCartEntry(event.item),
                tableElement.children[tableElement.children.length - 1]
            );
        }
        totalElement.children[2].innerText = parseFloat(totalElement.children[2].innerText) + event.item.price;
    }
    function getEntryElement(id) {
        return entryElements.find(entry => entry.data === id);
    }
    function createCartEntry(item) {
        return create('tr',
            {data: item.id},
            create('td', {'innerText': item.product}),
            create('td', {},
                create('button', {innerText: '-', data: item.id,  onclick: onDecrementCartItem})
            ),
            create('td', {innerText: item.units, data: item.id, 'style.textAlign': 'right'}),
            create('td', {},
                create('button', {innerText: '+', data: item.id, onclick: onIncrementCartItem})
            ),
            create('td', {innerText: item.unitPrice})
            )
    }
    const items = await getCartItems();
    const total = items.reduce((sum, item) => sum += item.units * item.unitPrice, 0);
    const entryElements = items.map(item => createCartEntry(item));
    const totalElement = create('tr', {},
        create('td', {colSpan: 4},
            create('b', {innerText: 'Total'})
        ),
        create('td', {},
            create('b', {innerText: total, 'style.textAlign': 'right'})
        )
    );
    const tableElement = create('table', {},
        ...entryElements,
        totalElement
    );
    this.appendChild(tableElement);
    window.addEventListener('addCartItem', event => onAddCartItem(event));
};

async function load() {

    async function getProducts() {
        const response = await fetch('/products');
        if (response.status === 200) {
            const body = response.json();
            return body;
        } else {
            return [];
        }
    }

    async function getCartItems() {
        const response = await fetch('/cart');
        if (response.status === 200) {
            return await response.json();
        } else {
            return [];
        }
    }

    async function incrementCartItem(id) {
        const response = await fetch('/cart/' + id, {method: 'PUT'});
        return response.status === 204;
    }

    async function decrementCartItem(id) {
        const response = await fetch('/cart/' + id, {method: 'DELETE'});
        return response.status === 204;
    }

    async function addCartItem(item) {
        await fetch('/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
    }

    document.getElementById('catalog').catalog({getProducts});
    document.getElementById('cart').cart({getCartItems, incrementCartItem, decrementCartItem, addCartItem});
}