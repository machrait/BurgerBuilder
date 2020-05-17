import React, { useReducer, useCallback } from 'react';

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

const httpReducer = (currHttpState, action) => 
{
	switch (action.type)
	{
		case 'SEND':
			return  { loading: true, error: ''};
		case 'RESPONSE':
			return  { ...currHttpState, loading: false};
		case 'ERROR':
			return  { error: action.error, loading: false};
		case 'CLEAR':
			return  { ...currHttpState, error: ''};
		default:
			throw new Error('Should not happen!');
	}
};

const Ingredients = () =>
{
	const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
	//const [userIngredients, setUserIngredients] = useState([]);
	const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: ''});
	//const [isLoading, setIsLoading] = useState(false);
	//const [error, setError] = useState('');
	
	const addIngredientHandler = ingredient =>
	{
		dispatchHttp({type: 'SEND'});
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
			dispatchHttp({type: 'RESPONSE'});
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
		}).catch(error =>
		{
			dispatchHttp({type: 'RESPONSE'});
			dispatchHttp({type: 'ERROR', error: 'Something went wrong!'});
		});
		
	}

	const filteredIngredientsHandler = useCallback(filteredIngredients =>
	{
	//	setUserIngredients(filteredIngredients);
		dispatch({type: 'SET', ingredients: filteredIngredients});
	}, []);

	const removeIngredientsHandler = ingredientId =>
	{
		dispatchHttp({type: 'SEND'});
		fetch(`https://reacthooks-9a40e.firebaseio.com/ingredients/${ingredientId}.json`,
		{
			method: 'DELETE'
		}).then(response =>
		{
			dispatchHttp({type: 'RESPONSE'});
			//setUserIngredients(prevIngredients => 
			//	prevIngredients.filter(ingredient => ingredient.id !==  ingredientId));
			dispatch({type: 'DELETE', id: ingredientId});
		}).catch(error =>
		{
			dispatchHttp({type: 'RESPONSE'});
			dispatchHttp({type: 'ERROR', error: 'Something went wrong!'});
		});
		
	}

	const closeErrorHandler = () =>
	{
		dispatchHttp({type: 'CLEAR'});
	}

	return (	
	<div className="App">
		{httpState.error && <ErrorModal onClose={closeErrorHandler}>{httpState.error}</ErrorModal>}
    	<IngredientForm onAddIngredient={addIngredientHandler} loading= {httpState.loading}/>

    	<section>
        	<Search onLoadIngredients={filteredIngredientsHandler}/>
      		<IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientsHandler}/>
    	</section>
    </div>
  );
}

export default Ingredients;
