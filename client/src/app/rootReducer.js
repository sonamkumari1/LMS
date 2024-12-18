import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@/features/api/authApi";
import authReducer from "../features/authSlice"


const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer, // Adding the API slice reducer
  auth: authReducer, // Adding the authentication reducer
});

export default rootReducer;
