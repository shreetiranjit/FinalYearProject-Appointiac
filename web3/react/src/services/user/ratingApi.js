import axios from "axios";

// You can modify this base URL as needed
const instance = axios.create({
  baseURL: "http://localhost:3001/api/ratings",
});

export const rateUser = async (ratedUserId, stars, reviewText) => {
  const addr = localStorage.getItem("address");
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored as a JSON string

  if (!user) {
    throw new Error("User not logged in");
  }

  try {
    const response = await instance.post(
      `/`, // Modify the endpoint if it's different
      {
        rated_user: ratedUserId,
        stars: stars,
        review: reviewText,
        addr: addr
      },
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while rating user", error);
    throw error;
  }
};

export const fetchAverageRating = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.get(`/user/${userId}/average`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch average rating");
    }

    // Notice that you don't need to call `response.json()` since the `instance` from axios will automatically parse the JSON.
    const data = response.data;

    return data.averageRating; // Return just the average rating value
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserRatingsAndReviews = async (userId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in or token missing");
  }

  try {
    const response = await instance.get(`/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch user ratings and reviews");
    }

    const data = response.data;

    return data; // This will return an array of ratings and reviews for the user
  } catch (error) {
    console.error("Error while fetching user ratings and reviews", error);
    throw error; // It's good to re-throw the error so that it can be caught and handled by the caller of this function
  }
};
