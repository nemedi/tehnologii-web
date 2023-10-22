class AbstractStorage {

    constructor() {
        if (this.constructor === AbstractStorage) {
            throw new Error('Abstract class cannot be instantiated.');
        }
    }

    load() {
        throw new Error('This method is not implemented.');
    }

    store() {
        throw new Error('This method is not implemented.');
    }

    get() {
        throw new Error('This method is not implemented.');
    }

    set() {
        throw new Error('Unimplemented method.');
    }
}

class InMemoryStorage extends AbstractStorage {

    #store = {};

    constructor() {
        super();
    }

    load() {
        console.log('Loading in-memory storage.');
    }

    store() {
        console.log('Storing in-memory storage.');
    }

    get(key) {
        return this.#store[key];
    }

    set(key, value) {
        this.#store[key] = value;
    }
}

try {
    const abstractStore = new AbstractStorage();
    abstractStore.load();
    abstractStore.store();
} catch (error) {
    console.error(error.message);
}

const inMemoryStorage = new InMemoryStorage();
inMemoryStorage.load();
inMemoryStorage.set('password', 'secret');
const password = inMemoryStorage.get('password');
console.log(`Password is: ${password}.`);
inMemoryStorage.store();