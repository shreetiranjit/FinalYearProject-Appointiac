import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Layout";
import Sidebar from "../navigation/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"; // Import necessary components

import {
  getAppointmentsById,
  getListings,
} from "../../../services/user/timeslotApi";

const Analytics = () => {
  useEffect(() => {}, []);
  const [isOpen, setIsOpen] = useState(false);
  const addr = localStorage.getItem("address");

  const [appointments, setAppointments] = useState([]);
  const [purchasedTimeSlots, setPurchasedTimeSlots] = useState([]);

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

  useEffect(
    () => async () => {
      try {
        const allListings = await getListings();
        const filteredListings = allListings.filter(
          (listing) => listing.owned_by === addr
        );
        setPurchasedTimeSlots(filteredListings);
      } catch (err) {
        console.error(err);
      }

      const fetchData = async () => {
        try {
          const conts = await getAppointmentsById(addr);
          const mappedAppointments = conts.map((appointment) => ({
            ...appointment,
            purchasedBy: !appointment.is_owned
              ? "Not Sold"
              : appointment.current,
            remainingDays: getRemainingDays(appointment.expiry_date),
          }));
          setAppointments(mappedAppointments);
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    },
    [addr]
  );
  console.log(appointments);
  const getAnalytics = () => {
    const totalListings = appointments.length;
    const soldListings = purchasedTimeSlots.filter(
      (slot) => slot.is_owned
    ).length;
    const activeListings = appointments.filter(
      (slot) => !slot.is_expired
    ).length;
    const forAuctionListings = appointments.filter(
      (slot) => slot.for_auction
    ).length;
    const averageAuctionPrice =
      purchasedTimeSlots.reduce((acc, slot) => acc + slot.auction_price, 0) /
      totalListings;

    const frequencyData = ["daily", "weekly", "monthly"].map((freq) => {
      const count = appointments.filter(
        (slot) => slot.frequency === freq
      ).length;
      return { name: freq, value: count };
    });

    return {
      totalListings,
      soldListings,
      activeListings,
      forAuctionListings,
      averageAuctionPrice,
      frequencyData,
    };
  };
  const data = getAnalytics();

  const summaryData = [
    { name: "Sold Listings", value: data.soldListings },
    { name: "Active Listings", value: data.activeListings },
    { name: "Listings for Auction", value: data.forAuctionListings },
  ];

  return (
    <Layout>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow p-6 overflow-x-hidden">
        <div className="flex h-screen bg-gray-50 overflow-x-hidden">
          <div className="flex-grow p-6 overflow-x-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
              <div className="rounded bg-blue-500 p-4 text-white shadow-md">
                <header>
                  <h2 className="text-3xl font-bold"> {data.totalListings}</h2>
                  <p className="font-semibold">Total Listings</p>
                </header>
              </div>
              <div className="rounded bg-black p-4 text-white shadow-md">
                <header>
                  <h2 className="text-3xl font-bold">{data.soldListings}</h2>
                  <p className="font-semibold">Sold Listings</p>
                </header>
              </div>
              <div className="rounded bg-blue-500 p-4 text-white shadow-md">
                <header>
                  <h2 className="text-3xl font-bold">{data.activeListings}</h2>
                  <p className="font-semibold">Active Listings</p>
                </header>
              </div>
              <div className="rounded bg-black p-4 text-white shadow-md">
                <header>
                  <h2 className="text-3xl font-bold">
                    {data.forAuctionListings}
                  </h2>
                  <p className="font-semibold">Listings for Auction</p>
                </header>
              </div>
              {/* <div className="rounded bg-blue-600 p-4 text-white shadow-md">
                <header>
                  <h2 className="text-3xl font-bold">
                    NPR {data.averageAuctionPrice.toFixed(2)}
                  </h2>
                  <p className="font-semibold">Average Auction Price</p>
                </header>
              </div> */}
            </div>

            {/* Bar Chart */}
            {/* <div className="mt-8 p-4 bg-white rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Frequency Data</h2>
              <BarChart width={600} height={300} data={data.frequencyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </div> */}

            {/* Pie Charts - Displayed Side by Side */}
            <div className="flex mt-8 justify-between">
              <div className="p-4 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Active Listings Data</h2>
                <PieChart width={500} height={500}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={summaryData}
                    cx={200}
                    cy={200}
                    outerRadius={200}
                    fill="#8884d8"
                    label
                  >
                    {summaryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              <div className="p-4 bg-white rounded-md shadow-md px-20">
                <h2 className="text-2xl font-semibold mb-4">
                  Frequency Pie Chart
                </h2>
                <PieChart width={500} height={500}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data.frequencyData}
                    cx={250}
                    cy={200}
                    outerRadius={180}
                    fill="#8884d8"
                    label
                  >
                    {data.frequencyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Analytics;
