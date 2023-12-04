import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api/", // replace with your API base URL
});

export const registerUser = async (userData) => {
  try {
    const response = await instance.post("/auth/register", userData);
    return response;
  } catch (error) {
    console.error("Error while registering user", error);
    throw error;
  }
};

export const loginUser = async (userCredentials) => {
  try {
    const response = await instance.post("/auth/login", userCredentials);
    return response;
  } catch (error) {
    console.error("Error while logging in user", error);
    throw error;
  }
};

export const validateToken = async (token) => {
  var user = localStorage.getItem("user");
  try {
    const response = await instance.post(
      "/auth/loginroutes",
      {user: user},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while validating token", error);
    throw error;
  }
};
