import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import counterReducer from './store/reducers/counter';
import resultReducer from './store/reducers/result';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';

const rootReducer = combineReducers({
    ctr: counterReducer,
    res: resultReducer
});

const logger = store =>
{
	return next => 
	{
		return action =>
		{
			console.log('MIDDLEWARE Dispatching',action);
			const result = next(action);
			console.log('MIDDLEWARE next state',store.getState());
			return result;
		}
	}
};

const store = createStore(rootReducer, applyMiddleware(logger));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
