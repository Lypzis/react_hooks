import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';

// Now it is able to listen to the context thoughout the app;

const app = (
	<AuthContextProvider>
		<App />
	</AuthContextProvider>
);

ReactDOM.render(app, document.getElementById('root'));
