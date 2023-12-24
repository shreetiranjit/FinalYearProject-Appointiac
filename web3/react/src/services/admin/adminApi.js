import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api/admin/", // replace with your API base URL
});

export const validateAdminToken = async (token) => {
  try {
    const response = await instance.post(
      "/loginWithToken",
      {},
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
export const loginAdmin = async (adminCredentials) => {
  try {
    const response = await instance.post("/login", adminCredentials);
    return response;
  } catch (error) {
    console.error("Error while logging in admin", error);
    throw error;
  }
};

export const fetchAllUsers = async() => {
  var token = localStorage.getItem("admin");
  try {
    const response = await instance.get("/users", 
    {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data;
  } catch (error) {
    console.error("Error while fetching users", error);
    throw error;
  }
}
