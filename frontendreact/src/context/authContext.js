import React, { createContext, useReducer } from "react";
import { authReducer } from "./authReducer";
import { api } from "../utils/apiUrl";
import setAuthToken from "../utils/setAuthToken";
import axios from "axios";

export const initialState = {
  token: localStorage.getItem("token"),
  loading: null,
  error: null,
  successmsg: null,
  user: null,
  isAuthenticated: false,
};

export const authContext = createContext(initialState);

export default function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  //loading user
  const loadUser = async () => {
    setAuthToken(localStorage.token);
    try {
      const response = await axios.get(`${api}/auth/me`);

      dispatch({
        type: "USER_LOADED",
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${api}/auth/login`, {
        email,
        password,
      });
      const { data } = response;
      if (data.error) {
        dispatch({
          type: "ERROR_USER",
          payload: data.error,
        });
      } else {
        dispatch({
          type: "LOGIN_USER",
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  //chaneg password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(`${api}/auth/passwordChange`, {
        currentPassword,
        newPassword,
      });
      const { data } = response;
      if (data.error) {
        dispatch({
          type: "ERROR_USER",
          payload: data.error,
        });
      } else {
        dispatch({
          type: "CHANGE_PASSWORD",
          payload: data,
        });
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <authContext.Provider
      value={{
        token: state.token,
        loading: state.loading,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        error: state.error,
        successmsg: state.successmsg,
        dispatch,
        changePassword,
        loadUser,
        login,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
}
