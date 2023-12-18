import axios from "axios";
import { getBalance } from "../wallet/profile";
const instance = axios.create({
  baseURL: "http://localhost:3001/api/timeslot",
});

export const createAppointment = async (appointment) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.post("/", appointment, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while creating appointment", error);
    throw error;
  }
};

export const getAppointmentsById = async (userId) => {
  const addr = localStorage.getItem("address");

  try {
    const response = await instance.get(`/allslots/${addr}`);
    const data = response.data.timeSlots;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error while getting appointments", error);
    throw error;
  }
};

// function for updateAppointment

export const updateAppointment = async (appointmentId, appointment) => {
  const token = localStorage.getItem("token");

  console.log(appointmentId, appointment);
  try {
    const response = await instance.patch(`/${appointmentId}`, appointment, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while updating appointment", error);
    throw error;
  }
};
//resell appointment
export const resellAppointment = async (appointmentId, appointment) => {
  const token = localStorage.getItem("token");

  console.log(appointmentId, appointment);
  try {
    const response = await instance.patch(`/${appointmentId}`, {
      ...appointment,
      forsale: true,
      auction_price: appointment.resellPrice
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while updating appointment", error);
    throw error;
  }
};


// delete appointment
export const deleteAppointment = async (appointmentId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.delete(`/${appointmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while deleting appointment", error);
    throw error;
  }
};

// get all appointments
export const getListings = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.get("/listings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while getting listings", error);
    throw error;
  }
};

export const placeBid = async (timeSlotId, bidAmount) => {
  const addr = localStorage.getItem("address");

  const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored as a JSON string

  if (!user) {
    throw new Error("User not logged in");
  }

  try {
    const response = await instance.post(
      `/bid/${timeSlotId}`,
      { bidAmount, addr }
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while placing bid", error);
    throw error;
  }
};
export const purchaseTimeSlot = async (timeSlotId) => {
  const seed = localStorage.getItem("seed");

  const balresp = await getBalance()
  try {
    const response = await instance.post(
      `/purchase/${timeSlotId}`,
      { seed: seed,
      balance: balresp.data.balance }, // Passing the new owner's ID from local storage

    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while purchasing time slot", error);
    throw error;
  }
};
