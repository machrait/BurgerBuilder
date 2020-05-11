import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as burgerBuilderActions from '../../store/actions';

class BurgerBuilder extends Component
{
	/*constructor(props)
	{
		super(props);
		this.state
	}*/
	state = {
		purchasing: false
	}

	updatePurchaseState (ingredients) 
	{
		const sum = Object.keys(ingredients).map(igKey => 
		{
			return ingredients[igKey];
		}).reduce((sum, el) => {
			return sum + el;
		}, 0);
		return  sum > 0;
	}

	purchasingHandler = () => 
	{
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () =>
	{
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () =>
	{
		this.props.history.push('/checkout');
	}

	render()
	{
		const disabledInfo = {
			...this.props.ings
		};
		for (let key in disabledInfo)
		{
			disabledInfo[key] = disabledInfo[key]<= 0
		}
		let orderSummary = null, burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
		
		if(this.props.ings)
		{
			burger = (<Aux>
						<Burger ingredients={this.props.ings}/>
						<BuildControls
							ingredientAdded = {this.props.onIngredientAdded}
							ingredientRemoved = {this.props.onIngredientRemoved}
							disabled = {disabledInfo}
							purchasable = {this.updatePurchaseState(this.props.ings)}
							price = {this.props.price}
							ordered = {this.purchasingHandler}/>
					</Aux>);
			orderSummary = <OrderSummary 
								ingredients={this.props.ings}
								purchaseCancelled={this.purchaseCancelHandler}
								purchaseContinued={this.purchaseContinueHandler}
								price = {this.props.price}/>;
		}

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	}
}

const mapDispatchToProps = dispath => {
	return {
		onIngredientAdded: (ingName) => dispath(burgerBuilderActions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispath(burgerBuilderActions.removeIngredient(ingName))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));