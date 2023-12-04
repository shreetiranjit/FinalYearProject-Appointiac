import {useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    toast.success("Logged Out successfully!");
    localStorage.removeItem("secret");
    localStorage.removeItem("address");
    navigate("/");
  }, []);
  return null;
};

export default Logout;
