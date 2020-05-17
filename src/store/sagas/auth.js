
import { put, delay } from 'redux-saga/effects';
import * as actions from '../actions';
import axios from 'axios';
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

export function* authUserSaga(action)
{
	yield put(actions.authStart());
	const authData = 
	{
		email: action.email,
		password: action.password,
		returnSecureToken: true
	};
	let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDHyCgtV0pAkcTkaVBJgEUMTLgnd6S3QOg';
	if (!action.isSignup)
	{
		url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDHyCgtV0pAkcTkaVBJgEUMTLgnd6S3QOg';
	}
	try 
	{
		const response = yield axios.post(url,authData);
		const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
		yield localStorage.setItem('token', response.data.idToken);
		yield localStorage.setItem('expirationDate', expirationDate);
		yield localStorage.setItem('userId', response.data.localId);
		yield put(actions.authSuccess(response.data.idToken,response.data.localId));
		yield put(actions.chechAuthTimeout(response.data.expiresIn));
	}
	catch(err) 
	{
		yield put(actions.authFail(err.response.data.error));
	};
}