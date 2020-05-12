import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../utility';

const initialeState = {
	token: null,
	userId: null,
	error: null,
	loading: false,
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
		default: return state;
	}
}
	

export default reducer;