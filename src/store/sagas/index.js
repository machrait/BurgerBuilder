import { takeEvery, all, takeLatest } from 'redux-saga/effects'; 

import * as actionTypes from '../actions/actionsTypes';
import { logoutSaga, chechAuthTimeoutSaga, authUserSaga, authCheckState } from './auth';
import { initIngredientsSaga } from './burgerBuilder';
import { purchaseBurgerSaga, fetchOrdersSaga } from './order';

export function* watchAuth() 
{
	yield all([	
		takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, chechAuthTimeoutSaga),
		takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
		takeEvery(actionTypes.AUTH_USER, authUserSaga),
		takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckState)
	]);
}

export function* watchBurgerBuilder() 
{
	yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}

export function* watchOrder() 
{
	yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
	yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}