import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import {toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import { deleteUserProfile } from "../../../services/user/profileApi";
import Sidebar from "../navigation/Sidebar";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeactivation, setConfirmDeactivation] = useState("");
  const [checkedTerms, setCheckedTerms] = useState(false);
  const navigate = useNavigate();

  const handleDeactivateAccount = async () => {
    try {
        // Delete the user profile account
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        await deleteUserProfile(userId);

        toast('Account deactivated successfully.');

    } catch (error) {
        // Display an error message if there's a problem deleting the account
        console.error('There was a problem deactivating your account.', error);
        toast('Failed to deactivate account. Please try again.');
        return; // Return early to avoid clearing local storage and redirecting if there was an error.
    }

    // Clear local storage
    localStorage.clear();

    // Redirect to the registration page
    navigate("/register");
};


  return (
    <Layout>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow p-6 overflow-x-hidden">
        <div className="flex h-screen bg-gray-50 overflow-x-hidden">
          <div className="flex-grow p-6 overflow-x-hidden">
            <div className="w-full sm:w-3/4 md:w-1/2 mx-auto p-8">
              <h2 className="text-primary-600 text-2xl font-semibold mb-6 text-center">
                Settings
              </h2>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <button
                    className="mb-4 bg-red-500 text-white rounded px-4 py-2"
                    onClick={() => setShowModal(true)}
                  >
                    Deactivate Account
                  </button>
                </div>

                {showModal && (
                  <div className="modal bg-white p-8 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">
                      Confirm Deactivation
                    </h3>
                    <p>Are you sure you want to deactivate your account?</p>

                    <input
                      type="text"
                      placeholder="Type 'CONFIRM' to deactivate"
                      className="border mt-4 p-2 rounded w-full"
                      onChange={(e) => setConfirmDeactivation(e.target.value)}
                    />

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mr-2"
                        checked={checkedTerms}
                        onChange={() => setCheckedTerms(!checkedTerms)}
                      />
                      <label htmlFor="terms">
                        I have read and accept the terms of deactivation.
                      </label>
                    </div>

                    <button
                      className="bg-red-500 text-white rounded px-4 py-2 mt-4"
                      disabled={
                        !(confirmDeactivation === "CONFIRM" && checkedTerms)
                      }
                      onClick={handleDeactivateAccount}
                    >
                      Deactivate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
