import { takeEvery } from 'redux-saga/effects'; 

import * as actionTypes from '../actions/actionsTypes';
import { logoutSaga, chechAuthTimeoutSaga, authUserSaga, authCheckState } from './auth';
import { initIngredientsSaga } from './burgerBuilder';

export function* watchAuth() 
{
	yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, chechAuthTimeoutSaga);
	yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
	yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
	yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckState);
}

export function* watchBurgerBuilder() 
{
	yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}