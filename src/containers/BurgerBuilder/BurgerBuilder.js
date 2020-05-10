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
import * as actionTypes from '../../store/actions';
const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}
class BurgerBuilder extends Component
{
	/*constructor(props)
	{
		super(props);
		this.state
	}*/
	state = {
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount()
	{
		/*axios.get('https://burgerbuilder-2020.firebaseio.com/ingredients.json')
		.then(response => {
			this.setState({ingredients: response.data});
		}).catch(error => {
			this.setState({error: true});
		});*/
	}

	updatePurchaseState (ingredients) 
	{
		const sum = Object.keys(ingredients).map(igKey => 
		{
			return ingredients[igKey];
		}).reduce((sum, el) => {
			return sum + el;
		}, 0);
		this.setState({purchasable: sum > 0});
	}

	addIngredientHandler = (type) => 
	{
		const oldCount = this.props.ings[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.props.ings
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => 
	{
		const oldCount = this.props.ings[type];
		if(oldCount <= 0)
		{
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.props.ings
		};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
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
		//alert('You continue!');
		
		const queryParams = [];
		for (let i in this.props.ings)
		{
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]));
		}
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
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
							ingredientAdded = {this.addIngredientHandler}
							ingredientRemoved = {this.removeIngredientHandler}
							disabled = {disabledInfo}
							purchasable = {this.state.purchasable}
							price = {this.state.totalPrice}
							ordered = {this.purchasingHandler}/>
					</Aux>);
			orderSummary = <OrderSummary 
								ingredients={this.props.ings}
								purchaseCancelled={this.purchaseCancelHandler}
								purchaseContinued={this.purchaseContinueHandler}
								price = {this.state.totalPrice}/>;
		}

		if(this.state.loading)
		{
			orderSummary = <Spinner />;
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
		ings: state.ingredients
	}
}

const mapDispatchToProps = dispath => {
	return {
		onIngredientAdded: (ingName) => dispath({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
		onIngredientRemoved: (ingName) => dispath({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));