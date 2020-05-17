
import { put } from 'redux-saga/effects';
import * as actions from '../actions';
import axios from 'axios';


export function* initIngredientsSaga(action)
{
	const response = yield axios.get('https://burgerbuilder-2020.firebaseio.com/ingredients.json')
	try 
	{	
		yield put(actions.setIngredients(response.data));
    }
	catch(err) 
	{
		yield put(actions.fetchIngredientsFailed());
	};
}