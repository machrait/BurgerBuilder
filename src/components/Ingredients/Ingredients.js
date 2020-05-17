import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () =>
{
	const [userIngredients, setUserIngredients] = useState([]);
	
	const addIngredientHandler = ingredient =>
	{
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
			return response.json();
		}).then(responseData =>
		{	
			setUserIngredients(previngredients => 
			[	
				...previngredients, 
				{ 
					id: responseData.name, 
					...ingredient
				}
			]);
		});
		
	}

	const filteredIngredientsHandler = useCallback(filteredIngredients =>
	{
		setUserIngredients(filteredIngredients);
	}, [setUserIngredients]);

	return (	
	<div className="App">
    	<IngredientForm onAddIngredient={addIngredientHandler}/>

    	<section>
        	<Search onLoadIngredients={filteredIngredientsHandler}/>
      		<IngredientList ingredients={userIngredients} onRemoveItem={() => {}}/>
    	</section>
    </div>
  );
}

export default Ingredients;
