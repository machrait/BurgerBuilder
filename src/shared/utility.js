
export const updateObject = (oldObject, updatedProperties) =>
{
	return {
		...oldObject,
		...updatedProperties
	};
};

export const checkValidity = (value,rules) =>
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
};