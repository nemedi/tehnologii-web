class Chat {
	#sessions = {};
	#messages = [];
	login(name, session) {
		if (Object.values(this.#sessions)
			.find(user => user === name)) {
			return false;
		} else {
			this.#sessions[session] = name;
			return true;
		}
	}
	getMessages(index) {
		return this.#messages.slice(parseInt(index));
	}
	addMessage(message, session) {
		if (this.#sessions[session] !== undefined) {
			this.#messages.push(
				`${this.#sessions[session].toUpperCase()}: ${message}`);
			return true;
		} else {
			return false;
		}
	}
	logout(session) {
		if (this.#sessions[session] !== undefined) {
			delete this.#sessions[session];
			return true;
		} else {
			return false;
		}
	}
}
export default new Chat();