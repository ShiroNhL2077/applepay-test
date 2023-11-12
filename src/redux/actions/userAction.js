import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_USER_SUCCESS,
  CLEAR_ERRORS,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  IS_ADMIN,
  GET_USER_ORDERS_REQUEST,
  GET_USER_ORDERS_SUCCESS,
  GET_USER_ORDERS_FAIL,
  INVOICE_CLICKED,
  TICKET_CLICKED,
} from "../constants/userConstants";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

//User Login
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${apiUrl}login`,
      { email, password },
      config
    );
    window.location.reload();
    const token = data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data.user));

    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// User Logout
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get(`${apiUrl}logout`);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();

    dispatch({ type: LOGOUT_USER_SUCCESS });
  } catch (error) {
    // Handle any errors that might occur during the logout process.
    console.error("Logout failed: ", error);
  }
};

// User Load
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${apiUrl}auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data,
    });

    const role = data.role;

    if (role && role === "admin") {
      dispatch({
        type: IS_ADMIN,
        payload: true,
      });
    } else {
      dispatch({
        type: IS_ADMIN,
        payload: false,
      });
    }
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      // payload: error.response.data.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${apiUrl}auth/forgot-password`,
      { email },
      config
    );
    console.log({ data });
    const jsonString = JSON.stringify(data);
    localStorage.setItem("forgetPwFeedback", jsonString);
    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.error,
    });
    console.log(error.response.data.error);
  }
};

// Reset Password
export const resetPassword = (token, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${apiUrl}auth/reset-password/${token}`,
      { newPassword },
      config
    );
    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// Get logged in User Orders
export const getUserOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_ORDERS_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${apiUrl}orders/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: GET_USER_ORDERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_ORDERS_FAIL,
      payload: error.response ? error.response.data.message : 'Failed to fetch user orders',
    });
  }
};

export const invoiceClicked = (invoiceData) => ({
  type: INVOICE_CLICKED,
  payload: invoiceData,
});

export const ticketClicked = (ticketData) => ({
  type: TICKET_CLICKED,
  payload: ticketData,
});
