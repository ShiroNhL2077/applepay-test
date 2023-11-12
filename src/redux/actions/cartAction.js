import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  INCREMENT_CART_ITEM,
  REMOVE_FROM_CART,
} from "../constants/cartConstants";

// add to cart
export const addItemsToCart =
  (cartItems, eventData, selectedDate) => async (dispatch, getState) => {
    const payload = {
      cartItems,
      eventData,
      selectedDate,
    };

    dispatch({
      type: ADD_TO_CART,
      payload: payload,
    });

    localStorage.setItem("cartEvent", JSON.stringify(eventData));
    localStorage.setItem("cartTickets", JSON.stringify(cartItems));
    localStorage.setItem("ticketsDate", JSON.stringify(selectedDate));
  };

// remove cart item
export const removeItemsFromCart = (index) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: index,
  });
};

export const incrementCartItem = (index) => ({
  type: INCREMENT_CART_ITEM,
  payload: index,
});

export const decrementCartItem = (index) => ({
  type: DECREMENT_CART_ITEM,
  payload: index,
});
