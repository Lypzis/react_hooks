import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

// local ingredients reducer, cleaner logic,
// solves the multiple usage of 'setUserIngredients' useState
const ingredientReducer = (currentIngredientsState, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [...currentIngredientsState, action.ingredient];
		case 'DELETE':
			return currentIngredientsState.filter(
				ing => ing.id !== action.ingredientId
			);
		default:
			throw new Error('Something went wrong! D:');
	}
};

const Ingredients = props => {
	// state, dispatch function to call reducer actions
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []); // reducer, initialState(empty array in this case);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [isLoadingRemove, setIsLoadingRemove] = useState(false);

	useEffect(() => console.log('RENDERING INGREDIENTS', userIngredients), [
		userIngredients,
	]);

	// to avoid triggering a recreation of functions loop at 'Search.js', add 'useCallback'
	const filteredIngredientsHandler = useCallback(
		ingredients => dispatch({ type: 'SET', ingredients }), // if reducer returns a new state, React will re-render
		[]
	); // could pass 'userIngredients' here, but it's redundant, since it is already used in previous 'useEffect'

	// DEPRECATED, already fetch ingredients at Search.js, which renders here, no need to load twice
	// after every render cycle, by default without dependencies
	// useEffect(() => {
	// 	loadIngredients();
	// }, []);
	// const loadIngredients = async () => {
	// 	const response = await fetch(
	// 		'https://react-hooks-update-39786.firebaseio.com/ingredients.json'
	// 	);

	// 	const responseData = await response.json();

	// 	const loadedIngredients = [];

	// 	for (const key in responseData)
	// 		loadedIngredients.push({ ...responseData[key], id: key });

	// 	setUserIngredients(loadedIngredients);
	// };

	const addIngredientHandler = async ingredient => {
		setIsLoading(true);

		const response = await fetch(
			'https://react-hooks-update-39786.firebaseio.com/ingredients.json',
			{
				method: 'POST',
				body: JSON.stringify(ingredient),
				headers: { 'Content-type': 'application/json' },
			}
		);

		const responseData = await response.json();

		setIsLoading(false);

		// the 'name' is the 'id', because firebase...
		dispatch({
			type: 'ADD',
			ingredient: { id: responseData.name, ...ingredient },
		});
	};

	const removeIngredientHandler = async id => {
		try {
			setIsLoadingRemove(true);

			await fetch(
				`https://react-hooks-update-39786.firebaseio.com/ingredients/${id}.json`,
				{
					method: 'DELETE',
				}
			);

			setIsLoadingRemove(false);

			dispatch({ type: 'DELETE', ingredientId: id });
		} catch (err) {
			setError(err.message);
		}
	};

	const clearError = () => {
		setError(null);
		setIsLoadingRemove(false);
	};

	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />

				<IngredientList
					loading={isLoadingRemove}
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
