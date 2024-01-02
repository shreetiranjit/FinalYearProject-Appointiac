import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api/user/",
});

export const fetchUserProfile = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.get(`${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.message,
      error.response
    );

    throw error;
  }
};

export const updateUserProfilePic = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await instance.patch(`${userId}/profilePic`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};


export const deleteUserProfile = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.delete(`${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};

export const updateUserCertifications = async (userId, certificationFile) => {
  const formData = new FormData();
  formData.append("certification", certificationFile);

  try {
    const response = await instance.patch(
      `${userId}/certifications`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating certifications:", error);
    throw error;
  }
};