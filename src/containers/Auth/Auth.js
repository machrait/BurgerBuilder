import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions';
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

	submitHandler = (event) =>
	{
		event.preventDefault();
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
	}

	inputChangedHandler = (event, controlName) =>
	{
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			}
		};
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
		const form = formElementsArray.map(formElement =>
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
		return (
			<div className={classes.Auth}>
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

const mapDispatchToProps = dispath => {
	return {
		onAuth: (email, password, isSignup) => dispath(actions.auth(email, password, isSignup)),
	}
}

export default connect(null,mapDispatchToProps)(withErrorHandler(Auth, axios));
