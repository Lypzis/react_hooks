import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = props => {
	const [userIngredients, setUserIngredients] = useState([]);

	// after every render cycle, by default without dependencies
	useEffect(() => {
		loadIngredients();
	}, []);

	useEffect(() => console.log('RENDERING INGREDIENTS', userIngredients), [
		userIngredients,
	]);

	const filteredIngredientsHandler = filteredIngredients =>
		setUserIngredients(filteredIngredients);

	const loadIngredients = async () => {
		const response = await fetch(
			'https://react-hooks-update-39786.firebaseio.com/ingredients.json'
		);

		const responseData = await response.json();

		const loadedIngredients = [];

		for (const key in responseData)
			loadedIngredients.push({ ...responseData[key], id: key });

		setUserIngredients(loadedIngredients);
	};

	const addIngredientHandler = async ingredient => {
		const response = await fetch(
			'https://react-hooks-update-39786.firebaseio.com/ingredients.json',
			{
				method: 'POST',
				body: JSON.stringify(ingredient),
				headers: { 'Content-type': 'application/json' },
			}
		);

		const responseData = await response.json();

		setUserIngredients(prevIngredients => [
			...prevIngredients,
			{ id: responseData.name, ...ingredient }, // the 'name' is the 'id', because firebase...
		]);
	};

	const removeIngredientHandler = id => {
		const filteredArr = [...userIngredients].filter(ing => ing.id !== id);
		setUserIngredients(filteredArr);
	};

	return (
		<div className='App'>
			<IngredientForm onAddIngredient={addIngredientHandler} />

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
