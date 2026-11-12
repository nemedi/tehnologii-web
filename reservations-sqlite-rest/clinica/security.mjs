import {existsSync, readFileSync} from 'fs';
import basicAuth from 'express-basic-auth';

export default basicAuth({
	authorizer: (user, password) => {
		const file = './credentials.json';
		if (existsSync(file)) {
			const credentials = JSON.parse(readFileSync(file));
			return Object.hasOwn(credentials, user) && credentials[user] === password;
		}
		return false;
	}
});
