
import { put } from 'redux-saga/effects';
import * as actions from '../actions';
import axios from '../../axios-orders';


export function* purchaseBurgerSaga(action)
{
	yield put(actions.purchaseBurgerStart());
	const response = yield axios.post('/orders.json?auth=' + action.token, action.orderData);
	try 
	{	
		yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
	}
	catch(err) 
	{
		yield put(actions.purchaseBurgerFail(err));
	};
}

export function* fetchOrdersSaga(action)
{
	yield put(actions.fetchOrdersStart());
	const queryParams = '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"';
	const response = yield axios.get('/orders.json' + queryParams);
	try 
	{	
		let fechtedOrders = [];
		for (let key in response.data)
		{
			fechtedOrders.push({id: key, ...response.data[key]});
		}
		yield put(actions.fetchOrdersSuccess(fechtedOrders));
	}
	catch(err) 
	{
		yield put(actions.purchaseBurgerFail(err));
	};
}