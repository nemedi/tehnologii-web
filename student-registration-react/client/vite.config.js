import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// The REST API is served by ../student-registration/server (port 8080).
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': 'http://localhost:8080'
		}
	}
});
