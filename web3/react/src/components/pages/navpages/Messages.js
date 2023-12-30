import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Layout";
import Sidebar from "../navigation/Sidebar";

const Messages = () => {
  useEffect(() => {}, []);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Layout>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow p-6 overflow-x-hidden">
        <div className="flex h-screen bg-gray-50 overflow-x-hidden">
          <div className="flex-grow p-6 overflow-x-hidden">
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
