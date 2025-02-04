import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi", // Name for the API slice in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API, // Base URL for the API
    credentials: "include", // Send cookies with requests for authentication
  }),
  endpoints: (builder) => ({
    // Register User Mutation
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register", // Appended to the base URL to make the final endpoint
        method: "POST", // HTTP method for the request
        body: inputData, // Request body (data to be sent)
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // Await the API response
          dispatch(userLoggedIn({ user: result.data.user })); // Dispatch the userLoggedIn action to update the state
        } catch (error) {
          console.log("Register Error:", error); // Log any errors
        }
      },
    }),

    // Login User Mutation
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login", // Endpoint for login
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // Await the API response
          dispatch(userLoggedIn({ user: result.data.user })); // Dispatch the userLoggedIn action to update the state
        } catch (error) {
          console.log("Login Error:", error); // Log any errors
        }
      },
    }),
    logoutUser:builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {  
          dispatch(userLoggedOut()); 
        } catch (error) {
          console.log("Login Error:", error); // Log any errors
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile", // Endpoint for user profile
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // Await the API response
          dispatch(userLoggedIn({ user: result.data.user })); // Dispatch the userLoggedIn action to update the state
        } catch (error) {
          console.log("Register Error:", error); // Log any errors
        }
      },
    }),

    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update", // Endpoint for updating user profile
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),
  }),
});

// Export mutation hooks
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authApi;
