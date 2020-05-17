
import { put, delay, call } from 'redux-saga/effects';
import * as actions from '../actions';
import axios from 'axios';
export function* logoutSaga(action)
{
	yield call([localStorage,'removeItem'],'token');
	yield call([localStorage,'removeItem'],'userId');
	yield call([localStorage,'removeItem'],'expirationDate');
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
export function* authCheckState(action)
{
	const token = yield localStorage.getItem('token');
		if (!token)
		{
			yield put(actions.logout());
		}
		else
		{
			const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
			const userId = yield localStorage.getItem('userId');
			if (expirationDate > new Date())
			{
				yield put(actions.authSuccess(token,userId));
				yield put(actions.chechAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
			}
			else
			{
				yield put(actions.logout());
			}
		}
}