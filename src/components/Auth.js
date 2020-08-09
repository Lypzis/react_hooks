import React, { useContext } from 'react';

import Card from './UI/Card';
import { AuthContext } from '../context/auth-context';
import './Auth.css';

const Auth = props => {
	const authContext = useContext(AuthContext);

	// will set the context 'isAuth' variable to true,
	// changing the app content, as it is authenticated now :D
	const loginHandler = authContext.login;

	return (
		<div className='auth'>
			<Card>
				<h2>You are not authenticated!</h2>
				<p>Please log in to continue.</p>
				<button onClick={loginHandler}>Log In</button>
			</Card>
		</div>
	);
};

export default Auth;
