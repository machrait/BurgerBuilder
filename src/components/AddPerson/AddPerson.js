import React, { Component } from 'react';

import './AddPerson.css';

class AddPerson extends Component 
{
	state = 
	{
		name: '',
		age: 0
	}
	nameChangedhandler = (event) =>
	{
		this.setState({name: event.target.value});
	}
	ageChangedhandler = (event) =>
	{
		this.setState({age: event.target.value});
	}
	render() {
	 	return (
			<div className="AddPerson">
				<input 
					onChange={this.nameChangedhandler}
					value={this.state.name}
					type="text" 
					placeholder="Enter your name"/>
				<input 
					onChange={this.ageChangedhandler}
					value={this.state.age}
					type="number" 
					placeholder="Enter your age"/>
				<button 
					onClick={() => this.props.personAdded(this.state.name, this.state.age)}>Add Person</button>
			</div>);
	}
}
export default AddPerson;