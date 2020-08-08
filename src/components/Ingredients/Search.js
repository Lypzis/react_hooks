import React, { memo, useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

// use memo for static components
const Search = memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState('');
	const inputRef = useRef();

	useEffect(() => {
		// PROBLEM: a timer is set every time a dependency changes, when user types
		const timer = setTimeout(() => {
			// 'inputRef' has value because refs to an input element
			// ref is immutable, so setTimeout will get THE current value in the input instead of one set 500ms ago
			// meaning that the equality here is: 'enteredFilter'(500ms ago) STILL equals to what is
			// 'inputRef.current.value'(after the lifecycle rendering finishes) at the input after
			// another 500ms to then trigger the if statement.
			// 'inputRef' needs to be a dependency of useEffect, for it to be asking every time the input value changes.
			if (enteredFilter === inputRef.current.value) {
				// firebase query params to send along the fetch request
				const query =
					enteredFilter.length === 0
						? ''
						: `?orderBy="title"&equalTo="${enteredFilter}"`;

				fetch(
					`https://react-hooks-update-39786.firebaseio.com/ingredients.json${query}`
				)
					.then(response => response.json())
					.then(responseData => {
						const loadedIngredients = [];

						for (const key in responseData)
							loadedIngredients.push({
								...responseData[key],
								id: key,
							});

						onLoadIngredients(loadedIngredients);
					});
			}
		}, 500);

		// 'useEffect' cleanup function, runs before every execution,
		// this will not run on the first execution though,
		// in this case, I want to clear the timer before setting a new one, to avoid memory leaks,
		// becoming memory efficient
		return () => clearTimeout(timer);
	}, [enteredFilter, onLoadIngredients, inputRef]); // this will not trigger every time anymore thanks to useCallback at 'ingredients.js'

	return (
		<section className='search'>
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
					<input
						ref={inputRef} // available because of 'useRef'
						type='text'
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
