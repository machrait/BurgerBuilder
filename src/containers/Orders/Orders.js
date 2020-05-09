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
			console.log(fechtedOrders);
		}).catch(err =>
		{
			this.setState({loading:false});
		});
	}
	

	render() 
	{
		let order = this.state.orders.map(order => 
			(
				<Order 
					key={order.id}
					ingredients={order.ingredients}
					price={order.price}/>
			));
		if(this.state.loading)
		{
			order = <p>Loading</p>;
		}

		return (
			<div>
				{order}
			</div>
		);
	}
}

export default withErrorHandler(Orders, axios);
