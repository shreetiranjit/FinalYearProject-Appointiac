import React, { useState } from "react";
import FormInput from "../../widgets/FormInput";
import { updateAppointment } from "../../../services/user/timeslotApi";
import Sidebar from "../navigation/Sidebar";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const EditAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;
    const appointmentId = appointment._id;
  const ownerId = JSON.parse(localStorage.getItem("user"))._id;
  const [startTime, setStartTime] = useState(
    appointment?.timestamp.split("-")[0] || ""
  );
  const [endTime, setEndTime] = useState(
    appointment?.timestamp.split("-")[1] || ""
  );
  const [amountPerSession, setAmountPerSession] = useState(
    appointment?.amount_per_session || 0
  );
  const [expiryDate, setExpiryDate] = useState(appointment?.expiry_date || "");
  const [forAuction, setForAuction] = useState(
    appointment?.for_auction ? "Yes" : "No"
  );
  const [auctionPrice, setAuctionPrice] = useState(
    appointment?.auction_price || ""
  );
  const [forSale, setForSale] = useState(appointment?.forsale ? "Yes" : "No");
  const [description, setDescription] = useState(
    appointment?.description || ""
  );
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const time = `${startTime}-${endTime}`;
      const appointment = {
        frequency: "weekly",
        ownerID: ownerId,
        timestamp: time,
        amount_per_session: amountPerSession,
        expiry_date: expiryDate,
        for_auction: forAuction === "Yes",
        forsale: forSale === "Yes",
        description: description,
        owned_by: ownerId,
      };
      if (forAuction === "Yes") {
        appointment.auction_price = auctionPrice;
      }
      await updateAppointment(appointmentId, appointment);
      toast.success("Appointment Edit successful!");
      navigate("/schedule");
    } catch (error) {
      console.error(error);
      toast.error("Error updating appointment: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create New Appointment Slot
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <FormInput
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Start Time"
              error={errors.startTime}
            />
            <FormInput
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="End Time"
              error={errors.endTime}
            />
            <FormInput
              id="amountPerSession"
              type="number"
              value={amountPerSession}
              onChange={(e) => setAmountPerSession(e.target.value)}
              placeholder="Amount Per Session"
              error={errors.amountPerSession}
            />
            <FormInput
              id="expiryDate"
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="Expiry Date"
              error={errors.expiryDate}
            />
            <div>
              <label>
                For Auction:
                <input
                  type="radio"
                  value="Yes"
                  checked={forAuction === "Yes"}
                  onChange={() => setForAuction("Yes")}
                />{" "}
                Yes
                <input
                  type="radio"
                  value="No"
                  checked={forAuction === "No"}
                  onChange={() => setForAuction("No")}
                />{" "}
                No
              </label>
            </div>
            {forAuction === "Yes" && (
              <FormInput
                id="auctionPrice"
                type="number"
                value={auctionPrice}
                onChange={(e) => setAuctionPrice(e.target.value)}
                placeholder="Auction Price"
                error={errors.auctionPrice}
              />
            )}
            <div>
              <label>
                For Sale:
                <input
                  type="radio"
                  value="Yes"
                  checked={forSale === "Yes"}
                  onChange={() => setForSale("Yes")}
                />{" "}
                Yes
                <input
                  type="radio"
                  value="No"
                  checked={forSale === "No"}
                  onChange={() => setForSale("No")}
                />{" "}
                No
              </label>
            </div>
            <FormInput
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              error={errors.description}
            />
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Update Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;
