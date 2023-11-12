import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  INCREMENT_CART_ITEM,
  REMOVE_FROM_CART,
} from "../constants/cartConstants";

const initialCartEvent = JSON.parse(localStorage.getItem("cartEvent")) || {};
const initialCartItems = JSON.parse(localStorage.getItem("cartTickets")) || [];

const initialState = {
  initialCartEvent,
  initialCartItems,
};

export const cartReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_TO_CART:
      return {
        ...state,
        initialCartEvent: {
          ...state.initialCartEvent,
          ...payload.eventData,
        },
        initialCartItems: [...state.initialCartItems, ...payload.cartItems],
      };
    case REMOVE_FROM_CART:
      const updatedCartItems = state.initialCartItems.filter(
        (item, index) => index !== payload
      );
      let updatedCartEvent = { ...state.initialCartEvent };

      // Check if cartTickets will be empty after the removal
      if (updatedCartItems.length === 0) {
        // If empty, remove both cartEvent and cartTickets
        localStorage.removeItem("cartEvent");
        localStorage.removeItem("cartTickets");
        localStorage.removeItem("ticketsDate");
      } else {
        // Update cartTickets in localStorage
        localStorage.setItem("cartTickets", JSON.stringify(updatedCartItems));
      }

      return {
        ...state,
        initialCartItems: updatedCartItems,
        initialCartEvent: updatedCartEvent,
      };
    case INCREMENT_CART_ITEM:
      const incrementedCart = [...state.initialCartItems];
      incrementedCart[payload].orderQty += 1;

      // Update the cartItems in local storage
      localStorage.setItem("cartTickets", JSON.stringify(incrementedCart));

      return {
        ...state,
        initialCartItems: incrementedCart,
      };

    case DECREMENT_CART_ITEM:
      if (state.initialCartItems[payload].orderQty > 1) {
        const decrementedCart = [...state.initialCartItems];
        decrementedCart[payload].orderQty -= 1;

        // Update the cartItems in local storage
        localStorage.setItem("cartTickets", JSON.stringify(decrementedCart));

        return {
          ...state,
          initialCartItems: decrementedCart,
        };
      }
      return state;
      
    default:
      return state;
  }
};
