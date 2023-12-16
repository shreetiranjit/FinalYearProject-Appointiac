import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Layout";
import Sidebar from "./../navigation/Sidebar";
import { useParams, useLocation } from "react-router-dom";
import { fetchProfileByAddress } from "../../../services/wallet/profile";
import { placeBid, purchaseTimeSlot } from "../../../services/user/timeslotApi";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  fetchAverageRating,
  fetchUserRatingsAndReviews,
  rateUser,
} from "../../../services/user/ratingApi";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [owner, setOwner] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const location = useLocation();
  const { listing } = location.state;
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      setAppointment(listing);
      const ownerData = await fetchProfileByAddress(listing.owner);
      setOwner(ownerData);

      // Fetch average rating
      const avgRating = await fetchAverageRating(listing.owner);
      setAverageRating(avgRating);

      try {
        const userRatings = await fetchUserRatingsAndReviews(listing.owner);
        console.log(userRatings);
        setReviews(userRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error.message);
      }
    };

    fetchDetails();
  }, [id]);
  

  const handleStarClick = (starNumber) => {
    setSelectedRating(starNumber);
  };

  const handleRatingSubmit = async () => {
    try {
      const ratedUserId = owner.name;
      const data = await rateUser(listing.owner, selectedRating, review);
      console.log("Successfully rated user:", data);
    } catch (error) {
      console.error("Failed to rate user:", error);
    }
  };
  const calculateTimeLeft = (expiryDate) => {
    const diffInMilliseconds = new Date(expiryDate) - new Date();
    const daysLeft = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    return daysLeft > 1 ? `${daysLeft} days` : `${daysLeft} day`;
  };

  if (!appointment || !owner) {
    return <p>Loading...</p>;
  }

  const hasExpired = () => {
    return new Date(appointment.expiry_date) < new Date();
  };
  const getLastBidUserId = () => {
    const bookedUsers = appointment.booked_users;
    if (bookedUsers && bookedUsers.length > 0) {
      const lastUser = bookedUsers[bookedUsers.length - 1];
      return lastUser;
    }
    return null;
  };
  if (!appointment || !owner) {
    return <p>Loading...</p>;
  }

  if (!appointment || !owner) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <Sidebar />
      <div className="flex-grow p-6 space-y-6">
        <OwnerDetail
          owner={owner}
          averageRating={averageRating}
          setRatingModalOpen={setRatingModalOpen}
        />
        <AppointmentDetail
          appointment={appointment}
          calculateTimeLeft={calculateTimeLeft}
          hasExpired={hasExpired}
          getLastBidUserId={getLastBidUserId}
        />

        {/* <Certifications certifications={owner.certifications} /> */}
        <Reviews reviews={reviews} />
      </div>

      <RatingModal
        isOpen={ratingModalOpen}
        onRequestClose={() => setRatingModalOpen(false)}
        handleStarClick={handleStarClick}
        selectedRating={selectedRating}
        review={review}
        setReview={setReview}
        handleRatingSubmit={handleRatingSubmit}
      />
    </Layout>
  );
};

const AppointmentDetail = ({
  appointment,
  calculateTimeLeft,
  hasExpired,
  getLastBidUserId,
}) => {
  const [raisePercent, setRaisePercent] = useState(0);
  const handleRaisePercentClick = (percent) => {
    setRaisePercent(percent);
  };

  const calculateBidAmount = () => {
    return parseFloat(
      appointment.auction_price * (1 + raisePercent / 100)
    ).toFixed(2);
  };
  const handlePurchaseClick = async () => {
    try {
      const response = await purchaseTimeSlot(appointment._id);

      if (response.message) {
        toast(response.message);
      } else {
        toast("Successfully purchased the time slot!");
      }
    } catch (error) {
      toast("Error purchasing the time slot. Please try again.");
    }
  };

  const handleBidClick = async () => {
    try {
      const bidAmount = calculateBidAmount();
      const response = await placeBid(appointment._id, bidAmount); // Assuming the appointment object has an `_id` property representing the timeslot ID

      if (response.message) {
        toast(response.message);
      }
    } catch (error) {
      toast("Error placing the bid. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold">Appointment Details</h2>
      <p className="text-gray-600">{appointment.description}</p>
      <p className="text-sm text-red-500">
        Expires in: {calculateTimeLeft(appointment.expiry_date)}
      </p>
      <p className="text-sm text-gray-600">Time: {appointment.timestamp}</p>

      <div className="mt-4 space-y-2">
        {appointment.for_auction && !hasExpired() && (
          <div>
            <div className="flex w-2/3 justify-between mb-2">
              {[
                { value: 5, label: "5%" },
                { value: 10, label: "10%" },
                { value: 20, label: "20%" },
                { value: 30, label: "30%" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleRaisePercentClick(btn.value)}
                  className={`py-1 px-3 rounded ${
                    raisePercent === btn.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button
              className="w-2/3 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              onClick={handleBidClick}
            >
              Bid - {calculateBidAmount()} ALGO
            </button>
          </div>
        )}
        {appointment.for_auction && hasExpired() && (
          <div>
            <button
              className="w-full bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
              disabled
            >
              Expired
            </button>
            <p className="text-sm mt-2 text-gray-500">
              The timeslot bidding has expired and user {getLastBidUserId()} has
              been allocated the appointment.
            </p>
          </div>
        )}
        {appointment.forsale && (
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handlePurchaseClick}
          >
            Buy - {appointment.amount_per_session} ALGO
          </button>
        )}
      </div>
    </div>
  );
};

const OwnerDetail = ({ owner, averageRating, setRatingModalOpen }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-6">
      <img
          className="h-8 w-8 rounded"
          src={`http://localhost:3001/api/public/pps/pixel_image_${Math.floor(Math.random() * 1000) + 1}.png`}
          alt="Avatar"
        />
        <div>
          <h2 className="text-xl font-bold">{owner.fullname}</h2>
          <button
            className="py-1 px-3 bg-yellow-500 text-white rounded hover:bg-green-600 focus:outline-none"
            onClick={() => setRatingModalOpen(true)}
          >
            Rate
          </button>
          <div className="flex">
            {[...Array(5)].map((star, idx) => (
              <svg
                key={idx}
                className={`h-5 w-5 ${
                  idx < Math.round(averageRating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 8.24l-7.19-.61L10 1 7.19 7.63 0 8.24l5.46 4.73L3.82 19z"></path>
              </svg>
            ))}
          </div>

          <p className="text-gray-600">{owner.skillset}</p>
        </div>
      </div>
    </div>
  );
};

// const Certifications = ({ certifications }) => {
//   return (
//     <div>
//       <h3 className="font-semibold text-lg">Certifications:</h3>
//       {certifications && certifications.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
//           {certifications.map((cert, idx) => (
//             <img
//               key={idx}
//               className="rounded object-cover h-32 w-full"
//               src={`http://localhost:3001/${cert}`}
//               alt={`Certification ${idx + 1}`}
//             />
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-600 mt-2">Not available</p>
//       )}
//     </div>
//   );
// };

const RatingModal = ({
  isOpen,
  onRequestClose,
  handleStarClick,
  selectedRating,
  review,
  setReview,
  handleRatingSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose(false)}
      className="flex items-center justify-center h-full outline-none"
      overlayClassName="fixed inset-0 bg-black opacity-90"
    >
      <div className="bg-white rounded-lg w-full md:max-w-lg mx-2 md:mx-0 p-6 space-y-4 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Rate the User
        </h2>

        <div className="flex justify-center space-x-2">
          {[...Array(5)].map((_, idx) => (
            <button key={idx} onClick={() => handleStarClick(idx + 1)}>
              <svg
                className={`h-8 w-8 cursor-pointer transition-colors duration-150 ${
                  idx < selectedRating ? "text-yellow-500" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 8.24l-7.19-.61L10 1 7.19 7.63 0 8.24l5.46 4.73L3.82 19z"></path>
              </svg>
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
          placeholder="Write your review..."
          className="mt-4 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={() => onRequestClose(false)}
            className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleRatingSubmit}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-150"
          >
            Rate
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Reviews = ({ reviews }) => {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-semibold text-xl mb-2">Reviews:</h3>

      {reviews.length > 0 ? (
        reviews.map((review, idx) => (
          <div
            key={idx}
            className="min-w-[250px] bg-gradient-to-br from-gray-100 to-gray-200 p-5 shadow-lg rounded-lg border border-gray-300"
          >
            {/* Star rating */}
            <div className="flex mb-3">
              {[...Array(5)].map((star, idx) => (
                <svg
                  key={idx}
                  className={`h-5 w-5 ${
                    idx < Math.round(review.stars)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15.27L16.18 19l-1.64-7.03L20 8.24l-7.19-.61L10 1 7.19 7.63 0 8.24l5.46 4.73L3.82 19z"></path>
                </svg>
              ))}
            </div>

            {/* Display username if it exists, else display a "Guest" placeholder */}
            <h4 className="font-medium mb-2">{review.reviewer.slice(0, 4)}...{review.reviewer.slice(-9)}</h4>
            <p className="text-sm text-gray-700">{review.review}</p>
          </div>
        ))
      ) : (
        <div className="bg-white p-5 shadow-md rounded-lg border border-gray-300">
          <p className="text-gray-600">No reviews available</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
