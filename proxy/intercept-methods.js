function interceptMethods(object, advisor) {
	return new Proxy(object, {
		get(target, property) {
			if (typeof target[property] === 'function') {
				return new Proxy(target[property], {
					apply: (target, thisArg, argumentsList) => {
						try {
							if (advisor && typeof advisor.before === 'function') {
								advisor.before(object, property, argumentsList);
							}
							const result = advisor && typeof advisor.insteadOf === 'function'
								? advisor.insteadOf(object, property, argumentsList)
								: Reflect.apply(target, thisArg, argumentsList);
							if (advisor && typeof advisor.after === 'function') {
								advisor.after(object, property, argumentsList, result);
							}
							return result;
						} catch (error) {
							if (advisor && typeof advisor.throwing === 'function') {
								advisor.throwing(object, property, argumentsList);
							}
						}
					}
				});
			} else {
				return Reflect.get(target, property);
			}
		}
	});
}
function Person(firstName, lastName) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.toString = function() {
		return `${this.firstName} ${this.lastName}`;
	}
	return this;
}
const advisor = {
	before: (target, property, argumentsList) => console.log(`before ${property}`),
	after: (target, property, argumentsList, result) => console.log(`after ${property}: ${result}`),
	insteadOf: (target, property, argumentsList) => {
		if (property === 'toString') {
			if (target.firstName === 'Ion' && target.lastName == 'Iliescu') {
				return 'Jos Iliescu!';
			} else if (target.firstName === 'Ion' && target.lastName == 'Ratiu') {
				return 'Traiasca Ratiu!';
			}
		}
		return Reflect.apply(target, property, argumentsList);
	}
};
person = interceptMethods(new Person('Ion', 'Iliescu'), advisor);
console.log(person.toString()); // Jon Iliescu!
person = interceptMethods(new Person('Ion', 'Ratiu'), advisor);
console.log(person.toString()); // Traiasca Ratiu!