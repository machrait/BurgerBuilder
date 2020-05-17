import React, { useReducer, useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => 
{
	switch (action.type)
	{
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [...currentIngredients, action.ingredient];
		case 'DELETE':
			return currentIngredients.filter(ing => ing.id !==  action.id);
		default:
			throw new Error('Should not happen!');
	}
};

const Ingredients = () =>
{
	const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
	//const [userIngredients, setUserIngredients] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	
	const addIngredientHandler = ingredient =>
	{
		setIsLoading(true);
		fetch('https://reacthooks-9a40e.firebaseio.com/ingredients.json',
		{
			method: 'POST',
			body: JSON.stringify(ingredient),
			headers: 
			{
				'Content-Type': 'application/json'
			}
		}).then(response =>
		{
			setIsLoading(false);
			return response.json();
		}).then(responseData =>
		{	
			dispatch(
			{	
				type: 'ADD', 
				ingredient: 
				{ 
					id: responseData.name, 
					...ingredient
				}
			});
			/*setUserIngredients(previngredients => 
			[	
				...previngredients, 
				{ 
					id: responseData.name, 
					...ingredient
				}
			]);*/
		});
		
	}

	const filteredIngredientsHandler = useCallback(filteredIngredients =>
	{
	//	setUserIngredients(filteredIngredients);
		dispatch({type: 'SET', ingredients: filteredIngredients});
	}, []);

	const removeIngredientsHandler = ingredientId =>
	{
		setIsLoading(true);
		fetch(`https://reacthooks-9a40e.firebaseio.com/ingredients/${ingredientId}.json`,
		{
			method: 'DELETE'
		}).then(response =>
		{
			setIsLoading(false);
			//setUserIngredients(prevIngredients => 
			//	prevIngredients.filter(ingredient => ingredient.id !==  ingredientId));
			dispatch({type: 'DELETE', id: ingredientId});
		}).catch(error =>
		{
			setError('Something went wrong!');
			setIsLoading(false);
		});
		
	}

	const closeErrorHandler = () =>
	{
		setError('');
	}

	return (	
	<div className="App">
		{error && <ErrorModal onClose={closeErrorHandler}>{error}</ErrorModal>}
    	<IngredientForm onAddIngredient={addIngredientHandler} loading= {isLoading}/>

    	<section>
        	<Search onLoadIngredients={filteredIngredientsHandler}/>
      		<IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientsHandler}/>
    	</section>
    </div>
  );
}

export default Ingredients;
