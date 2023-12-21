import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3001/api/"
});

export const fetchProfileAppId = async () => {
  try {
    const response = await instance.post(`appid/profile`, {
    });
    return response.data.message;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.message,
      error.response
    );

    throw error;
  }
};