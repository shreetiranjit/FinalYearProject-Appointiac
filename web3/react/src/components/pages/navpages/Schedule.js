import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import {
  updateAppointment,
  deleteAppointment,
  getAppointmentsById,
  getListings,
} from "../../../services/user/timeslotApi";
import Sidebar from "../../../components/pages/navigation/Sidebar";
import Layout from "../../../layout/Layout";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaBars, FaTimesCircle } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import Modal from "react-modal";
import { toast } from "react-toastify";

const Schedule = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [appointments, setAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [action, setAction] = useState("");
  const [purchasedTimeSlots, setPurchasedTimeSlots] = useState([]);
  const [resellPrice, setResellPrice] = useState("");

  const navigate = useNavigate();

  const handleResell = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const confirmResell = async () => {
    try {
      const updatedAppointment = {
        ...selectedAppointment,
        forsale: true,
        auction_price: resellPrice,
        amount_per_session: resellPrice,
      };

      await updateAppointment(updatedAppointment._id, updatedAppointment);

      // Here you can update your local state as required.
      // This is just an example, adapt as needed:
      setAppointments(
        (appointments || []).map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment
        )
      );

      toast.success("Appointment listed for resale!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error while reselling appointment", error);
      toast.error("Error while reselling appointment");
    }
  };

  useEffect(() => {
    const fetchPurchasedTimeSlots = async () => {
      const my_addr = localStorage.getItem("address");
      try {
        const allListings = await getListings();
        const filteredListings = allListings.filter(
          (listing) => listing.owned_by === my_addr
        );
        setPurchasedTimeSlots(filteredListings);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPurchasedTimeSlots();
  }, [user._id]);

  useEffect(() => {
    const addr = localStorage.getItem("address");
    const fetchData = async () => {
      try {
        const conts = await getAppointmentsById(addr);
        const mappedAppointments = conts.map((appointment) => ({
          ...appointment,
          purchasedBy: !appointment.is_owned
            ? "Not Sold"
            : appointment.current.username,
          remainingDays: getRemainingDays(appointment.expiry_date),
        }));
        setAppointments(mappedAppointments);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user._id]);


  
  const handleEdit = (appointment) => {
    console.log("navigating with appointment: ", appointment); // Add this line
    navigate(`/appointments/edit/${appointment._id}`, {
      state: { appointment },
    });
  };

  const handleDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setAction("delete");
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    try {
      if (action === "delete") {
        await deleteAppointment(selectedAppointment._id);
        toast.success("Appointment deleted successfully!");
        setAppointments(
          appointments.filter(
            (appointment) => appointment._id !== selectedAppointment._id
          )
        );
      } else {
        const updatedAppointment = {
          ...selectedAppointment,
          status: action === "pause" ? "paused" : "active",
        };
        await updateAppointment(updatedAppointment._id, updatedAppointment);
        setAppointments(
          (appointments || []).map((appointment) =>
            appointment._id === updatedAppointment._id
              ? updatedAppointment
              : appointment
          )
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getRemainingDays = (expiryDate) => {
    const remainingTime = new Date(expiryDate) - new Date();
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    if (remainingDays > 1) {
      return `${remainingDays}D`;
    } else if (remainingDays === 1) {
      return `${remainingDays}D`;
    } else if (remainingDays <= 0) {
      return "Expired";
    }
  };

  return (
    <Layout>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow p-6 overflow-x-hidden">
        <div className="flex h-screen bg-gray-50 overflow-x-hidden">
          <div className="flex-grow p-6 overflow-x-hidden">
            <div className="p-8 w-full">
              <div className="flex justify-between items-center flex-wrap">
                <h2 className="text-primary-600 text-2xl font-semibold">
                  My timeslots
                </h2>
                <Link
                  to="/create-appointment"
                  className="text-white bg-blue-600 p-2 rounded"
                >
                  Add New Timeslot
                </Link>
              </div>
              <div className="w-full overflow-x-auto mt-4">
                <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-4">Owner Name</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Amount Per Session</th>
                      <th className="p-4">Auction Price</th>
                      {/* <th className="p-4">Frequency</th> */}
                      <th className="p-4">Expires In</th>
                      <th className="p-4">Purchased By</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr
                        key={appointment._id}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                        }`}
                      >
                        <td className="p-4">{appointment.ownername || 'Not Sold'}</td>
                        <td className="p-4">{appointment.description}</td>
                        <td className="p-4">{appointment.timestamp}</td>
                        <td className="p-4">
                          {appointment.amount_per_session}
                        </td>
                        <td className="p-4">{appointment.auction_price}</td>
                        {/* <td className="p-4">{appointment.frequency}</td> */}
                        <td
                          className={`p-4 ${
                            appointment.remainingDays <= "5D"
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {appointment.remainingDays}
                        </td>
                        <td className="p-4">{appointment.purchasedBy}</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            {appointment.is_expired ? (
                              <FaTimesCircle className="text-red-600 cursor-pointer" />
                            ) : (
                              <>
                                <FaEdit
                                  className="text-primary-600 cursor-pointer"
                                  onClick={() => handleEdit(appointment)}
                                />

                                <FaTrash
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => handleDelete(appointment)}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center flex-wrap">
                  <h2 className="text-primary-600 text-2xl font-semibold">
                    Purchased timeslots
                  </h2>
                </div>
                <div className="w-full overflow-x-auto mt-4">
                  <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-black text-white">
                      <tr>
                        {/* <th className="p-4">Owner Name</th> */}
                        <th className="p-4">Description</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Amount Per Session</th>
                        <th className="p-4">Frequency</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchasedTimeSlots.map((timeSlot, index) => (
                        <tr
                          key={timeSlot._id}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                          }`}
                        >
                          {/* <td className="p-4">{timeSlot.owner}</td> */}
                          <td className="p-4">{timeSlot.description}</td>
                          <td className="p-4">{timeSlot.timestamp}</td>
                          <td className="p-4">{timeSlot.amount_per_session}</td>
                          <td className="p-4">{timeSlot.frequency}</td>

                          <td className="p-4">
                            <div className="flex space-x-2">
                              {timeSlot.is_expired ? (
                                <FaTimesCircle className="text-red-600 cursor-pointer" />
                              ) : (
                                <>
                                  <button
                                    className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                                    onClick={() => handleResell(timeSlot)}
                                  >
                                    Resell
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {isModalOpen && selectedAppointment && (
              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Appointment Action Confirmation"
                className="m-auto bg-white w-1/3 h-1/3 flex flex-col justify-center items-center rounded-xl border-2 border-primary-600"
              >
                <h2 className="text-lg text-primary-600 mb-4">
                  {action ? (
                    <>
                      Are you sure you want to {action}{" "}
                      {selectedAppointment.ownername}'s timeslot?
                    </>
                  ) : (
                    <>
                      Enter resale price for {selectedAppointment.ownername}'s
                      appointment
                      <input
                        type="text"
                        value={resellPrice}
                        onChange={(e) =>
                          setResellPrice(parseFloat(e.target.value))
                        }
                        className="border rounded mt-2 px-2 py-1"
                      />
                    </>
                  )}
                </h2>
                <div className="flex justify-around w-full">
                  <button
                    className="py-2 px-4 bg-primary-600 text-white rounded"
                    onClick={action ? confirmAction : confirmResell}
                  >
                    Yes
                  </button>
                  <button
                    className="py-2 px-4 bg-gray-300 text-black rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    No
                  </button>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
