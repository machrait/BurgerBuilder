import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialeState = {
	token: null,
	userId: null,
	error: null,
	loading: false,
	authRedirectPath: '/'
};


const authSuccess = (state, action) =>
{
	return updateObject(state, {
		loading: false,
		token: action.idToken,
		userId: action.userId,
		error: null
	});
};

const reducer = (state = initialeState, action) =>
{
	switch (action.type)
	{
		case actionTypes.AUTH_START: return updateObject(state, {loading: true, error: null});
		case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
		case actionTypes.AUTH_FAIL: return updateObject(state, {loading: false, error: action.error});
		case actionTypes.AUTH_LOGOUT: return updateObject(state, {token: null, userId: null});
		case actionTypes.SET_AUTH_REDIRECT_PATH: return updateObject(state, {authRedirectPath: action.path});
		default: return state;
	}
}
	

export default reducer;