import * as actionTypes from '../actions/actionsTypes';

const initialeState = {
	orders: [],
	loading: false
};


const reducer = (state = initialeState, action) =>
{
	switch (action.type)
	{
		case actionTypes.PURHCASE_BURGER_SUCCESS:
			const newOrder = {
				...action.orderData,
				id: action.orderId
			}
			return{
				...state,
				loading: false,
				orders: state.orders.concat(newOrder)
			};
		case actionTypes.PURHCASE_BURGER_FAIL:
			return{
				...state,
				loading: false
			};
		case actionTypes.PURCHASE_BURGER_START:
			return{
				...state,
				loading: true
			};
		default:
			return state;
	}
}
	

export default reducer;