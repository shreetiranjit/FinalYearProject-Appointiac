import React, { useState, useEffect } from "react";
import { FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Layout from "../../../layout/Layout";
import Sidebar from "../navigation/Sidebar";
import { Link } from "react-router-dom";
import { getListings } from "../../../services/user/timeslotApi";
import { fetchProfileByAddress } from "../../../services/wallet/profile";
import { useNavigate } from "react-router-dom";
import { getBalance } from "../../../services/wallet/profile";
import '../../pages/home/HomePage.css'

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const [listingOwner, setListingOwner] = useState({});
  const redirectToDetails = () => {
    navigate(`/appointment/${listing._id}`, { state: { listing } });
  };

  useEffect(() => {
    const fetchOwnerData = async () => {
      const data = await fetchProfileByAddress(listing.owner);
      setListingOwner(data);
    };

    fetchOwnerData();
  }, [listing.owner]);

  const [startTime, endTime] = listing.timestamp.split("-");
  const expiryDate = new Date(listing.expiry_date).toLocaleDateString();

  return (
    <div
    className="rounded-lg bg-white shadow-md p-4 m-2 max-w-md cursor-pointer" 
    onClick={redirectToDetails}
    >

      <div className="flex items-center">
        <img
          className="h-16 w-16 rounded"
          src={`http://localhost:3001/api/public/pps/pixel_image_${Math.floor(Math.random() * 1000) + 1}.png`}
          alt="Avatar"
        />

        <div className="ml-4">
          <h3 className="font-bold">{listingOwner.fullname}</h3>
          <p className="text-sm text-gray-500">Expiry date: {expiryDate}</p>
          <p className="text-sm text-gray-500">{listing.owner.slice(0, 7)}...{listing.owner.slice(-9)}</p>
        </div>
      </div>
      <div className="mt-4">

        <p className="text-sm text-gray-600">{listing.description}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          {startTime} - {endTime} NPT
        </p>
      </div>
      <div className="mt-4 flex items-center">
        {listing.for_auction && (
          <>
            <button className="btn-bid text-white px-4 py-1 rounded hover:bg-indigo-600">
              Bid
            </button>
            <p className="ml-4 text-gray-900 font-bold text-lg">
              {listing.auction_price}
              <img src="/algorandLogo.png" alt="Algorand" className="inline h-4 w-4 ml-1" />

            </p>
          </>
        )}
        {listing.forsale && (
          <>
            <button className="btn-primary text-white px-4 py-1 rounded hover:bg-blue-600">
              Buy
            </button>
            <p className="ml-4 text-gray-900 font-bold text-lg">
              {listing.amount_per_session}
              <img src="/algorandLogo.png" alt="Algorand" className="inline h-4 w-4 ml-1" />

            </p>
          </>
        )}
      </div>


    </div>
  );
};

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(""); // State for storing the current user's username
  const [balance, setBalance] = useState('Loading...');

  useEffect(() => {
    // You might want to replace this with your actual API call to fetch the current user's data
    const fetchCurrentUserData = async () => {
      const data = JSON.parse(localStorage.getItem("user"));

      setCurrentUser(data.username); // Assuming the returned data has a 'username' field
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
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const response = await getBalance();
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance('Error');
      }
    };

    loadBalance();
  }, []);
  const filteredListings = listings

  return (
    <Layout>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-grow  overflow-x-hidden">
        <div className="flex h-screen bg-gray-100 overflow-x-hidden">
          <div className="flex-grow  overflow-x-hidden">
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


              <div className="bg-blue-500 rounded-lg flex items-center px-2 py-1">
                <img src="/algorandLogo.png" alt="Algorand" className="inline h-6 w-6 ml-2 mr-1" />
                <p className="text-white font-bold text-lg">
                  {balance} ALGO
                </p>
              </div>

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

              <div className="rounded bg-black p-4 text-white shadow-md">
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

export default Dashboard;
