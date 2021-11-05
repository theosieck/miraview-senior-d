import { createStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/rootReducer';
/**
 * following: https://dev.to/bhatvikrant/redux-persist-v6-in-detail-react-10nh
 * and: https://github.com/stevens-cs546-cs554/CS-554/tree/master/redux/redux-react-example
 */

// configure redux-persist
const persistConfig = {
	key: 'root',
	storage	// imported from redux-persist - default is localStorage
}

// create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// create the store
const store = createStore(
	persistedReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// create the persisted store
const persistor = persistStore(store);

export {store, persistor};
// export {store};