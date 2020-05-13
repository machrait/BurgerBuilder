import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import classes from './Auth.module.css';
import * as actions from '../../store/actions';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { updateObject } from '../../shared/utility';
class Auth extends Component 
{
	state = {
		controls: {
			email: 
			{
				elementType: 'input',
				elementConfig: 
				{
					type: 'email',
					placeholder: 'E-mail address'
				},
				value: '',
				validation:
				{
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			password: 
			{
				elementType: 'input',
				elementConfig: 
				{
					type: 'password',
					placeholder: 'Password'
				},
				value: '',
				validation:
				{
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			},
		},
		isSignup: true
		
	}

	checkValidity(value,rules)
	{
		let isValid = true; const regex = /\S+@\S+\.\S+/;
		if(rules.required)
		{
			isValid = value.trim() !=='' && isValid;
		}
		if(rules.isEmail)
		{
			isValid = regex.test(value);
		}
		if(rules.minLength)
		{
			isValid = value.length >= rules.minLength && isValid;
		}
		if(rules.maxLength)
		{
			isValid = value.length <= rules.maxLength && isValid;
		}
		return isValid;
	}

	componentDidMount()
	{
		if(!this.props.buildingBurger && this.props.authRedirectPath !== '/')
		{
			this.props.onSetAuthRedirectPath();
		}
	}
	submitHandler = (event) =>
	{
		event.preventDefault();
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
	}

	inputChangedHandler = (event, controlName) =>
	{
		const updatedControls = updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
				value: event.target.value,
				valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			})
		});
		
		this.setState({controls: updatedControls});
	}

	switchAuthModeHandler = () =>
	{
		this.setState(prevState => 
		{
			return {isSignup: !prevState.isSignup};
		});
	}

	render() 
	{
		const formElementsArray =[];
		for (let key in this.state.controls)
		{
			formElementsArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}
		let form = formElementsArray.map(formElement =>
		{
			return (
				<Input 
					key={formElement.id}
					elementType={formElement.config.elementType}
					elementConfig={formElement.config.elementConfig}
					value={formElement.config.value}
					invalid={!formElement.config.valid}
					touched={formElement.config.touched}
					shouldValidate={formElement.config.validation}
					changed={(event) => this.inputChangedHandler(event, formElement.id)}/>);
				
		});
		if (this.props.loading)
		{
			form = <Spinner/>;
		}
		let errorMessage = null;
		if (this.props.error)
		{
			errorMessage = <p>{this.props.error.message}</p>;
		}
		let authRedirect = null;
		if (this.props.isAuthenticated)
		{
			authRedirect = <Redirect to={this.props.authRedirectPath}/>;
		}
		return (
			<div className={classes.Auth}>
				{authRedirect}
				{errorMessage}
				<form onSubmit={(event) => this.submitHandler(event)}>
					{form}
					<Button btnType="Success" >SUBMIT</Button>
				</form>
				<Button 
					btnType="Danger"
					clicked={this.switchAuthModeHandler}
					>SWITCH TO {this.state.isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
			</div>
		);
	}
}
const mapStateToProps = state => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath
	}
}
const mapDispatchToProps = dispath => {
	return {
		onAuth: (email, password, isSignup) => dispath(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispath(actions.setAuthRedirectPath('/'))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Auth, axios));
