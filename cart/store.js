async function getProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    if (response.status === 200) {
        const body = await response.json();
        return body;
    } else {
        return [];
    }
}

function getCartItems(session) {
    if (!session.cart) {
        session.cart = [];
    }
    return session.cart;
}

function addCartItem(session, newItem) {
    const items = getCartItems(session);
    const item = items.find(item => item.id === newItem.id);
    if (item) {
        item.units++;
    } else {
        items.push(newItem);
    }
}

function incrementCartItem(session, id) {
    const items = getCartItems(session);
    let index = items.findIndex(item => item.id === id);
    if (index) {
        items[index].units++;
        return true;
    } else {
        return false;
    }
}

function decrementCartItem(session, id) {
    const items = getCartItems(session);
    let index = items.findIndex(item => item.id === id);
    if (index) {
        items[index].units--;
        if (items[index].units === 0) {
            items.splice(index, 1);
        }
        return true;
    } else {
        return false;
    }
}

module.exports = {getProducts, getCartItems, addCartItem, incrementCartItem, decrementCartItem};