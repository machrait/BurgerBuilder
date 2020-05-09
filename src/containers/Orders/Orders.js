import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
class Orders extends Component 
{
	state = 
	{
		orders: [],
		loading: true
	}

	componentDidMount()
	{
		axios.get('/orders.json').then(res =>
		{
			let fechtedOrders = [];
			for (let key in res.data)
			{
				fechtedOrders.push({id: key, ...res.data[key]});
			}
			this.setState({orders: fechtedOrders, loading:false});
		}).catch(err =>
		{
			this.setState({loading:false});
		});
	}
	

	render() 
	{
		return (
			<div>
				<Order/>
				<Order/>
			</div>
		);
	}
}

export default withErrorHandler(Orders, axios);
