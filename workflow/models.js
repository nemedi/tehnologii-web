class City {

    #name;
    #district;
    #inhabitants = 0;

    constructor(line) {
        let values = line.split(',');
        if (values.length === 4) {
            this.#name = values[1];
            this.#district = values[2];
            this.#inhabitants = parseInt(values[3]);
        }
    }

    get name() {
        return this.#name;
    }

    get district() {
        return this.#district;
    }

    get inhabitants() {
        return this.#inhabitants;
    }

    toString() {
        return `${this.#name},${this.#district},${this.#inhabitants}`;
    }
}

class District {

    #name;
    #inhabitants = 0;

    constructor(name) {
        this.#name = name;
    }

    addCity(city) {
        if (this.#name === city.district) {
            this.#inhabitants += city.inhabitants;
        }
    }

    get name() {
        return this.#name;
    }

    get inhabitants() {
        return this.#inhabitants;
    }

    toString() {
        return `${this.#name},${this.#inhabitants}`;
    }
}

module.exports = {City, District};