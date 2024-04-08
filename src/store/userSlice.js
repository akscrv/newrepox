import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { API_URL } from "../ConfigApi";

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';



const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    loading: false
  },
  reducers: {
    setUser(state, action) {
      state.userData = action.payload;
    },
    removeUser(state) {
      state.userData = {}; // Clear user data
      state.loading = false
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  },
});

export const { setUser, removeUser, updateUser, setLoading } = userSlice.actions;
export default userSlice.reducer;

//thunks

export const logoutUser = (navigate) => {

  return async function logoutThunk(dispatch, getState) {

    fetch(`${API_URL}/users/users/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          dispatch(removeUser());
          navigate("/login");
        } else if (response.status == 401) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          dispatch(removeUser());
          navigate("/login");
        } else {
          console.error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("An error occurred during logout", error);
      });
  };
};



export function handleSignIn(userDetails, navigate) {


  return async function handleSignInThunk(dispatch, getState) {
    dispatch(setLoading(true));
    fetch(`${API_URL}/users/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userDetails.username, // Provide the user's email
        password: userDetails.password, // Provide the user's password
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("This is the data", data);
        if (data.token) {
          const decodedToken = jwtDecode(data.token.access);
          const expirationDate = new Date(decodedToken.exp * 1000);
          console.log(expirationDate);
          Cookies.set("accessToken", data.token.access, {
            expires: expirationDate,
          });

          const decodedRefreshToken = jwtDecode(data.token.refresh);
          const expirationDateRefreshToken = new Date(decodedRefreshToken.exp * 1000);
          console.log(expirationDateRefreshToken);
          Cookies.set("refreshToken", data.token.refresh, {
            expires: expirationDateRefreshToken,
          });


          dispatch(setUser(data));
          dispatch(setLoading(false));
          console.log("all data", data)

          if (data.role === "Admin") {
            navigate("/admin");
          } else if (data.role === "Company") {
            navigate("/company");
          } else if (data.role === "Pro") {
            navigate(`/pro`);
          } else if (data.role === "Operationteam") {
            navigate("/operation");
          } else if (data.role === "Worker") {
            navigate(`/worker`);
          } else {
            navigate(`/`);
          }
        } else {
          dispatch(setLoading(false));
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "User not found. Please check your credentials and try again.",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch(setLoading(false));
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred. Please try again.",
        });
      });
  };
}

