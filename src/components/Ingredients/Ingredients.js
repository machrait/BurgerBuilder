import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () =>
{
	const [userIngredients, setUserIngredients] = useState([]);

	useEffect(() =>
	{
		fetch('https://reacthooks-9a40e.firebaseio.com/ingredients.json').then(response =>
		{
			return response.json();
		}).then(responseData =>
		{	
			const loadedIngredient = [];
			for (const key in responseData)
			{
				loadedIngredient.push(
				{ 
					id: key, 
					title: responseData[key].title, 
					amount: responseData[key].amount
				});
			}
			setUserIngredients(loadedIngredient);
		}, []);
	});
	
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
	return (	
	<div className="App">
    	<IngredientForm onAddIngredient={addIngredientHandler}/>

    	<section>
        	<Search />
      		<IngredientList ingredients={userIngredients} onRemoveItem={() => {}}/>
    	</section>
    </div>
  );
}

export default Ingredients;
