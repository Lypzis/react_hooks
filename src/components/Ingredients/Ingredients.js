import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

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
			throw new Error('Something went terribly wrong! D:');
	}
};

const httpReducer = (currentHttpState, action) => {
	switch (action.type) {
		case 'SEND':
			return { loading: true, error: null };
		case 'SEND_REMOVE':
			return { ...currentHttpState, loadingRemove: true };
		case 'RESPONSE':
			return { ...currentHttpState, loading: false };
		case 'RESPONSE_REMOVE':
			return { ...currentHttpState, loadingRemove: false };
		case 'ERROR':
			return { loading: false, loadingRemove: false, error: action.err };
		case 'CLEAR_ERROR':
			return { ...currentHttpState, error: null };
		default:
			throw new Error('Something went terribly wrong! D:');
	}
};

const Ingredients = props => {
	// state, dispatch function to call reducer actions
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []); // reducer, initialState(empty array in this case);
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		loadingRemove: false,
		error: null,
	});

	useEffect(() => console.log('RENDERING INGREDIENTS', userIngredients), [
		userIngredients,
	]);

	// to avoid triggering a recreation of functions loop at 'Search.js', add 'useCallback'
	const filteredIngredientsHandler = useCallback(
		ingredients => dispatch({ type: 'SET', ingredients }), // if reducer returns a new state, React will re-render
		[]
	); // could pass 'userIngredients' here, but it's redundant, since it is already used in previous 'useEffect'

	const addIngredientHandler = useCallback(async ingredient => {
		dispatchHttp({ type: 'SEND' });

		const response = await fetch(
			'https://react-hooks-update-39786.firebaseio.com/ingredients.json',
			{
				method: 'POST',
				body: JSON.stringify(ingredient),
				headers: { 'Content-type': 'application/json' },
			}
		);

		const responseData = await response.json();

		dispatchHttp({ type: 'RESPONSE' });

		// the 'name' is the 'id', because firebase...
		dispatch({
			type: 'ADD',
			ingredient: { id: responseData.name, ...ingredient },
		});
	}, []);

	const removeIngredientHandler = useCallback(async id => {
		try {
			dispatchHttp({ type: 'SEND_REMOVE' });

			await fetch(
				`https://react-hooks-update-39786.firebaseio.com/ingredients/${id}.json`,
				{
					method: 'DELETE',
				}
			);

			dispatchHttp({ type: 'RESPONSE_REMOVE' });
			dispatch({ type: 'DELETE', ingredientId: id });
		} catch (err) {
			dispatchHttp({ type: 'ERROR', err: err.message });
		}
	}, []);

	const clearError = useCallback(() => {
		dispatchHttp({ type: 'CLEAR_ERROR' });
	}, []);

	// now with 'useMemo' it will only rebuild the list if one
	// of the passed dependencies changes, though
	// for components  a MUCH BETTER ALTERNATIVE IS TO USE REACT.MEMO at
	// the component, so only use this if some heavy logic is contained
	// at the component, so it won't rebuild every time the page state changes
	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				loading={httpState.loadingRemove}
				ingredients={userIngredients}
				onRemoveItem={removeIngredientHandler}
			/>
		);
	}, [userIngredients, httpState, removeIngredientHandler]);

	const ingredientForm = useMemo(() => {
		return (
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={httpState.loading}
			/>
		);
	}, [httpState, addIngredientHandler]);

	return (
		<div className='App'>
			{httpState.error && (
				<ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
			)}

			{ingredientForm}

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />

				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
