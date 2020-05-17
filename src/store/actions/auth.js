import * as actionTypes from './actionsTypes';

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
	/*localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('expirationDate');*/
	return {
		type: actionTypes.AUTH_INITIATE_LOGOUT
	};
};

export const logoutSucceed = () =>
{
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const chechAuthTimeout = (expirationTime) =>
{
	return{
		type: actionTypes.AUTH_CHECK_TIMEOUT,
		expirationTime: expirationTime
	};
};

export const auth = (email, password, isSignup) =>
{
	return{	
		type: actionTypes.AUTH_USER,
		email: email, 
		password: password,
		isSignup: isSignup
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
				dispatch(chechAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
			}
			else
			{
				dispatch(logout());
			}
		}
	}
}