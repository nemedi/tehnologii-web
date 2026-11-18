import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import Application from './Application.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<HashRouter>
			<Application />
		</HashRouter>
	</StrictMode>
);
