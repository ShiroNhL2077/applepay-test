import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { forgotPasswordReducer, userOrdersReducer, userReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';


const middleware = [thunk]

const reducer = combineReducers({
    user: userReducer,
    forgetPassword: forgotPasswordReducer,
    cart: cartReducer,
    orders: userOrdersReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;