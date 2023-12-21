import axios from "axios";
const instance = axios.create({
    baseURL: "http://localhost:3001/api/profile/"
});

export const fetchProfileByAddress = async (address) => {
    try {
        const response = await instance.get(`/${address}`, {
        });
        console.log(response.data);
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

export const getBalance = async () => {
    const seed = localStorage.getItem("seed");
    // Assuming seed is a string, you should send it as a JSON object
    const response = await instance.post('getBalance/', { seed: seed });
    return response;
}

export const transferAndOptIn = async () => {
    const seed = localStorage.getItem("seed");
    // Assuming seed is a string, you should send it as a JSON object
    const response = await instance.post('optin/', { seed: seed });
    return response;
}

export const transferFromGodAccount = async () => {
    const seed = localStorage.getItem("seed");
    const response = await instance.post('transferFromGodAccount/', { seed: seed });
    return response;
}

export const optIntoProfileContract = async () => {
    const seed = localStorage.getItem("seed");
    const response = await instance.post('optIntoProfileContract/', { seed: seed });
    return response;
}

export const optIntoTimeslotContract = async () => {
    const seed = localStorage.getItem("seed");
    const response = await instance.post('optIntoTimeslotContract/', { seed: seed });
    return response;
}

export const createProfileTransaction = async () => {
    const seed = localStorage.getItem("seed");
    const response = await instance.post('createProfileTransaction/', { seed: seed });
    return response;
}


export const updateUserProfile = async (userData) => {
    // const seed = localStorage.getItem("seed");
    try {
        const response = await instance.patch(``, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user details:", error);
        throw error;
    }
};

// export const updateUserProfile = async (userId, userData) => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await instance.patch(`${userId}`, userData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // localStorage.setItem("user", JSON.stringify(response.data));
//       return response.data;
//     } catch (error) {
//       console.error("Error updating user details:", error);
//       throw error;
//     }
//   };
  