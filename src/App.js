import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
	// rebuilt whenever context changes :D,
	// that is why use 'useContext' instead of directly getting
	// stuff from, for example 'AuthContext' object
	const authContext = useContext(AuthContext);

	//default
	let content = <Auth />;

	// only accessible if user is authenticated
	if (authContext.isAuth) content = <Ingredients />;

	return content;
};

export default App;
