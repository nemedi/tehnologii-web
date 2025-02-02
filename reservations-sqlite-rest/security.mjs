import {existsSync, readFileSync} from 'fs';
import basicAuth from 'express-basic-auth';

export default basicAuth({
	authorizer: (user, password) => {
		const file = './credentials.json';
		console.log(`Authenticate against ${file}.`);
		if (existsSync(file)) {
			const credentials = JSON.parse(readFileSync(file));
			return credentials[user] === password;
		} else {
			return false;
		}
	}
});