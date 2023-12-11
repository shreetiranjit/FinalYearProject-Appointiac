import React, { useState, useEffect } from "react";
import { FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Layout from "../../../layout/Layout";
import Sidebar from "../navigation/Sidebar";
import { Link } from "react-router-dom";
import { getListings } from "../../../services/user/timeslotApi";
import { fetchUserProfile } from "../../../services/user/profileApi";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const [listingOwner, setListingOwner] = useState({});
  const redirectToDetails = () => {
    navigate(`/appointment/${listing._id}`, { state: { listing } });
  };

  useEffect(() => {
    const fetchOwnerData = async () => {
      const data = await fetchUserProfile(listing.owner);
      setListingOwner(data);
    };

    fetchOwnerData();
  }, [listing.owner]);

  const [startTime, endTime] = listing.timestamp.split("-");
  const expiryDate = new Date(listing.expiry_date).toLocaleDateString();

  return (
    <div
      className="rounded-lg bg-white shadow-md p-4 m-2 max-w-xs"
      onClick={redirectToDetails}
    >
      <div className="flex items-center">
        <img
          className="h-12 w-12 rounded-full"
          src={
            `http://localhost:3001/api/public/pps/pixel_image_${[Math.floor(Math.random() * 1000)]}.png`
          }
          alt="Avatar"
        />
        <div className="ml-4">
          <h3 className="font-bold">{listing.ownername}</h3>
          <p className="text-sm text-gray-500">Expiry date: {expiryDate}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{listing.description}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          {startTime} - {endTime}
        </p>
      </div>
      <div className="mt-4">
        {listing.for_auction && (
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Bid
          </button>
        )}
        {listing.forsale && (
          <button className="bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600">
            Buy
          </button>
        )}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {listing.for_auction && (
          <p>Auction Price: Rs. {listing.auction_price}</p>
        )}
        {listing.forsale && <p>Sale Price: Rs. {listing.amount_per_session}</p>}
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(""); // State for storing the current user's username

  useEffect(() => {
    // You might want to replace this with your actual API call to fetch the current user's data
    const fetchCurrentUserData = async () => {
      const userr = JSON.parse(localStorage.getItem("user"));

      setCurrentUser(userr.username); // Assuming the returned data has a 'username' field
    };

    fetchCurrentUserData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getListings();
      setListings(data);
    };

    fetchData();
  }, []);
  const [navOpen, setNavOpen] = useState(false);

  const toggleMenu = () => {
    setNavOpen(!navOpen);
  };

  const filteredListings = listings.filter((listing) =>
    listing.ownername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-grow p-1 overflow-x-hidden">
        <div className="flex h-screen bg-gray-50 overflow-x-hidden">
          <div className="flex-grow p-1 overflow-x-hidden">
            <nav className="flex items-center justify-between flex-wrap bg-primary-600 p-2">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight ml-2">
                  Appointiac
                </span>
              </div>

              <div className="text-sm lg:flex-grow lg:flex lg:justify-center">
                <div className="relative mt-4 pl-4 w-full lg:w-3/4 xl:w-1/2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search listings..."
                    className="form-input w-full p-3 rounded-full shadow-md transition duration-150 ease-in-out focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 pl-3 ">
                    <FaSearch />
                  </span>
                </div>
              </div>

              {/* Display the current user's username */}
              <div className="ml-4 text-white">{currentUser}</div>
            </nav>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
              <div className="rounded bg-blue-500 p-4 text-white shadow-md ">
                <Link to="/create-appointment">
                  <header>
                    <h2 className="text-3xl font-bold">
                      <FaPlus />{" "}
                    </h2>
                    <p className="font-semibold">Create Appointment</p>
                  </header>
                </Link>
              </div>

              <div className="rounded bg-yellow-500 p-4 text-white shadow-md">
                <Link to="/schedule">
                  <header>
                    <h2 className="text-3xl font-bold">
                      <FaEye />{" "}
                    </h2>
                    <p className="font-semibold">View Appointments</p>
                  </header>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap justify-start items-start overflow-x-auto p-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
