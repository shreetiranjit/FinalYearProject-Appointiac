import React, { useState } from "react";
import FormInput from "../../widgets/FormInput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "../../../services/user/timeslotApi";
import Sidebar from "../navigation/Sidebar";
import LoadingModal from "./LoadingModal";
const CreateAppointment = () => {
  const navigate = useNavigate();
  const ownerId = JSON.parse(localStorage.getItem("user"))._id;
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [amountPerSession, setAmountPerSession] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [forAuction, setForAuction] = useState("");
  const [auctionPrice, setAuctionPrice] = useState("");
  const [forSale, setForSale] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const time = `${startTime}-${endTime}`;
      const seed = localStorage.getItem('seed');
      const appointment = {
        frequency: "daily",
        ownerID: ownerId,
        timestamp: time,
        amount_per_session: amountPerSession,
        expiry_date: expiryDate,
        for_auction: forAuction === "Yes",
        forsale: forSale === "Yes",
        description: description,
        seed: seed
      };
      if (forAuction === "Yes") {
        appointment.auction_price = auctionPrice;
      }
      await createAppointment(appointment);
      toast.success("Appointment Creation successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error creating appointment: " + error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <LoadingModal isLoading={isLoading} message="Adding time slot to the blockchain..." />
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
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
