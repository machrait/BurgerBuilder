
import { put, delay } from 'redux-saga/effects';
import * as actions from '../actions';

export function* logoutSaga(action)
{
	yield localStorage.removeItem('token');
	yield localStorage.removeItem('userId');
	yield localStorage.removeItem('expirationDate');
	yield put(actions.logoutSucceed());
}

export function* chechAuthTimeoutSaga(action)
{
	yield delay(action.expirationTime * 1000);
	yield put(actions.logout());
}