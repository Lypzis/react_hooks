import React, { useState, memo } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = memo(props => {
	//const [inputState, setInputState] = useState({ title: '', amount: '' })
	const [enteredTitle, setEnteredTitle] = useState('');
	const [enteredAmount, setEnteredAmount] = useState('');

	const submitHandler = event => {
		event.preventDefault();

		props.onAddIngredient({
			title: enteredTitle,
			amount: enteredAmount,
		});
	};

	return (
		<section className='ingredient-form'>
			<Card>
				<form onSubmit={submitHandler}>
					<div className='form-control'>
						<label htmlFor='title'>Name</label>
						<input
							type='text'
							id='title'
							value={enteredTitle.title}
							onChange={event =>
								setEnteredTitle(event.target.value)
							}
						/>
					</div>
					<div className='form-control'>
						<label htmlFor='amount'>Amount</label>
						<input
							type='number'
							id='amount'
							value={enteredAmount.amount}
							onChange={event =>
								setEnteredAmount(event.target.value)
							}
						/>
					</div>
					<div className='ingredient-form__actions'>
						<button type='submit' disabled={props.loading}>
							{props.loading ? 'Adding...' : 'Add Ingredient'}
						</button>
						{props.loading && <LoadingIndicator />}
					</div>
				</form>
			</Card>
		</section>
	);
});

export default IngredientForm;
