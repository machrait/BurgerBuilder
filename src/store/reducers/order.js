import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialeState = {
	orders: [],
	loading: false,
	purchased: false
};

const purchaseSuccess = (state, action) =>
{
	const newOrder = updateObject(action.orderData, {id: action.orderId});
	return updateObject(state, {
		loading: false,
		orders: state.orders.concat(newOrder),
		purchased: true});
};

const fetchOrdersSuccess = (state, action) =>
{
	return updateObject(state, {
		loading: false,
		orders: action.orders});
};

const reducer = (state = initialeState, action) =>
{
	switch (action.type)
	{
		case actionTypes.PURHCASE_INIT: return updateObject(state, {purchased: false});
		case actionTypes.PURHCASE_BURGER_SUCCESS: return purchaseSuccess(state, action);
		case actionTypes.PURHCASE_BURGER_FAIL:
		case actionTypes.FETCH_ORDERS_FAIL: return updateObject(state, {loading: false});
		case actionTypes.PURCHASE_BURGER_START:
		case actionTypes.FETCH_ORDERS_START: return updateObject(state, {loading: true});
		case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess(state, action);
		default: return state;
	}
}
	

export default reducer;