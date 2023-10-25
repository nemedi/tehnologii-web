class City {
    #name;
    #district;
    #inhabitants;
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
        return `City(name = ${this.#name}, district = ${this.#district}, inhabitants = ${this.#inhabitants})`;
    }
    toCSV() {
        return `${this.#name},${this.#district},${this.#inhabitants}`;
    }
    toJSON() {
        return {
            name: this.name,
            district: this.#district,
            inhabitants: this.inhabitants
        }
    }    
}
class District {
    #name;
    #inhabitants;
    constructor(name) {
        this.#name = name;
        this.#inhabitants = 0;
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
        return `District(name = ${this.#name}, inhabitants = ${this.#inhabitants})`;
    }
    toCSV() {
        return `${this.#name},${this.#inhabitants}`;
    }
    toJSON() {
        return {
            name: this.name,
            inhabitants: this.inhabitants
        }
    }
}
module.exports = {City, District};