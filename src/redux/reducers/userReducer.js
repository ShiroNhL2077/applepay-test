import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_REQUEST,
    LOGIN_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    CLEAR_ERRORS,
    FORGOT_PASSWORD_REQUEST,
    RESET_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_FAIL,
    IS_ADMIN,
    GET_USER_ORDERS_REQUEST,
  GET_USER_ORDERS_SUCCESS,
  GET_USER_ORDERS_FAIL,
  INVOICE_CLICKED,
  TICKET_CLICKED,
} from '../constants/userConstants';

const ordersInitialState = {
    userOrders: [],
    loadingUserOrders: false,
    errorUserOrders: null,
    clickedInvoice: null,
    clickedTicket: null
  };

export const userReducer = (state = { user: {}, isAdmin: null }, { type, payload }) => {
    switch (type) {
        case LOGIN_USER_REQUEST:
        case REGISTER_USER_REQUEST:
        case LOAD_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false,
            };
        case LOGIN_USER_SUCCESS:
        case REGISTER_USER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: payload,
            };
        case LOGOUT_USER_SUCCESS:
            return {
                loading: false,
                user: null,
                isAuthenticated: false,
            };
        case LOGIN_USER_FAIL:
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: payload,
            };
        case LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: payload,
            }
        case LOGOUT_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        case IS_ADMIN:
            return {
                ...state,
                isAdmin: payload,
        };
        default:
            return state;
    }
};

export const forgotPasswordReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case FORGOT_PASSWORD_REQUEST:
        case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                message: payload,
            };
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: payload,
            };
        case FORGOT_PASSWORD_FAIL:
        case RESET_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const userOrdersReducer = (state = ordersInitialState, { type, payload }) => {
    switch (type) {
      case GET_USER_ORDERS_REQUEST:
        return {
          ...state,
          loadingUserOrders: true,
          errorUserOrders: null,
        };
  
      case GET_USER_ORDERS_SUCCESS:
        return {
          ...state,
          userOrders: payload,
          loadingUserOrders: false,
          errorUserOrders: null,
        };
  
      case GET_USER_ORDERS_FAIL:
        return {
          ...state,
          userOrders: [],
          loadingUserOrders: false,
          errorUserOrders: payload,
        };
        case INVOICE_CLICKED:
        return {
          ...state,
          clickedInvoice: payload,
        };
        case TICKET_CLICKED:
        return {
          ...state,
          clickedTicket: payload,
        };
  
      // Add other cases if needed
  
      default:
        return state;
    }
  };

 