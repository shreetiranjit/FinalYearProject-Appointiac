

import React, { useState, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
//import marketplace icon from react icons 
import { AiOutlineShopping, AiOutlineWallet } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
// import user icon from react icons
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiOutlineCalendar } from "react-icons/ai";
import { getBalance } from "../../../services/wallet/profile";
import algorandLogo from '../../../assets/images/algorandLogo.png';

const Sidebar = () => {
  const formatUsername = (username) => {
    if (username && username.length > 10) {
      return `${username.slice(0, 3)}...${username.slice(-9)}`;
    }
    return username;
  };
  const [balance, setBalance] = useState('Loading...');
  const username = localStorage.getItem('address');
  const formattedUsername = formatUsername(username);
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
  //     { name: "Messages", link: "/messages", icon: FiMessageSquare },
  const menus = [
    { name: formattedUsername, link: "/profile", icon: FaUserCircle },
    { name: "Marketplace", link: "/dashboard", icon: AiOutlineShopping },
    { name: "Schedule", link: "/schedule", icon: AiOutlineCalendar },
    { name: "Analytics", link: "/analytics", icon: TbReportAnalytics, margin: true },
    { name: "Setting", link: "/settings", icon: RiSettings4Line },
    { name: "Log Out", link: "/logout", icon: IoLogOutOutline },
    { name: `Balance: ${balance}`, link: "#", customIcon: algorandLogo, margin: true },
  ];
  const [open, setOpen] = useState(false);
  return (
    <section className="sticky top-0 h-full flex gap-6">
      <div
        className={`bg-[#0e0e0e] min-h-screen ${open ? "w-72" : "w-16"
          } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {
            menus?.map((menu, i) => (
              <Link
                to={menu?.link}
                key={i}
                className={` ${menu?.margin && "mt-5"} group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
              >
                <div>
                  {
                    menu.customIcon ? (
                      <img src={menu.customIcon} alt="Menu Icon" style={{ width: '20px', height: '20px' }} />
                    ) : 
                    (
                      React.createElement(menu?.icon, { size: "20" })
                    )
                  }
                </div>
                <h2
                  style={{
                    transitionDelay: `${i + 5}0ms`,
                  }}
                  className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"}`}
                >
                  {menu?.name}
                </h2>
                <h2
                  className={`${open && "hidden"} absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                >
                  {menu?.name}
                </h2>
              </Link>
            ))
          }

        </div>
      </div>
    </section>
  );
};

export default Sidebar;
 