import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://burgerbuilder-2020.firebaseio.com/'
});

export default instance;