import React, { memo, useState, useEffect, useCallback } from 'react';

import Card from '../UI/Card';
import './Search.css';

// use memo for static components
const Search = memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState('');

	useEffect(() => {
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
					loadedIngredients.push({ ...responseData[key], id: key });

				//On				onLoadIngredients(loadedIngredients);
			});
	}, [enteredFilter, onLoadIngredients]); // this will trigger every time 'enteredFilter' changes its value

	return (
		<section className='search'>
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
					<input
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
