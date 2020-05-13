import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const authStart = () =>
{
	return {
		type: actionTypes.AUTH_START
	};
};

export const authSuccess = (idToken, userId) =>
{
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: idToken,
		userId: userId
	};
};

export const authFail = (error) =>
{
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const logout = () =>
{
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('expirationDate');
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const chechAuthTimeout = (expirationTime) =>
{
	return dispatch =>
	{
		setTimeout(() => { dispatch(logout())}, expirationTime * 1000);
	};
};

export const auth = (email, password, isSignup) =>
{
	return dispatch =>
	{	
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDHyCgtV0pAkcTkaVBJgEUMTLgnd6S3QOg';
		if (!isSignup)
		{
			url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDHyCgtV0pAkcTkaVBJgEUMTLgnd6S3QOg';
		}
		axios.post(url,authData)
		.then(response => 
		{
			const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
			localStorage.setItem('token', response.data.idToken);
			localStorage.setItem('expirationDate', expirationDate);
			localStorage.setItem('userId', response.data.localId);
			dispatch(authSuccess(response.data.idToken,response.data.localId));
			dispatch(chechAuthTimeout(response.data.expiresIn));

		}).catch(err => 
		{
			dispatch(authFail(err.response.data.error));
		});
	};
	
};

export const setAuthRedirectPath = (path) =>
{
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	};
};

export const authCheckState = () =>
{
	return dispatch =>
	{
		const token = localStorage.getItem('token');
		if (!token)
		{
			dispatch(logout());
		}
		else
		{
			const expirationDate = new Date(localStorage.getItem('expirationDate'));
			const userId = localStorage.getItem('userId');
			if (expirationDate > new Date())
			{
				dispatch(authSuccess(token,userId));
				dispatch(chechAuthTimeout(expirationDate.getSeconds() - new Date.getSeconds()));
			}
			else
			{
				dispatch(logout());
			}
		}
	}
}