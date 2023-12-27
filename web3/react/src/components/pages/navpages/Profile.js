import React, { useState, useEffect } from "react";
import Layout from "../../../layout/Layout";
import Sidebar from "../navigation/Sidebar";
import LoadingModal from "./LoadingModal";
import {
  fetchProfileByAddress, updateUserProfile
} from "../../../services/wallet/profile";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const addr = localStorage.getItem('address');
      if (addr) {
        try {
          const resp = await fetchProfileByAddress(addr);
          setUserData(resp);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateUser = async () => {
    setIsLoading(true);
    const { _id, fullname, username, gender, bio } = userData;
    const seed = localStorage.getItem('seed');
    const toUpdate = {
      fullname,
      username,
      gender,
      bio,
      seed
    };

    try {
      const updatedUserData = await updateUserProfile(toUpdate);
      if (updatedUserData) {
        const updatedUser = await fetchProfileByAddress(localStorage.getItem('address'));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setEditMode(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <LoadingModal isLoading={isLoading} message="Updating profile on the blockchain..." /> 
      <div className="flex-grow p-6 overflow-x-hidden">
        <div className="flex h-screen bg-gray-50 overflow-x-hidden">
          <div className="flex-grow p-6 overflow-x-hidden">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col items-center">
                <button
                  className="mb-4 bg-primary-600 text-white rounded px-4 py-2"
                  onClick={() => setEditMode(!editMode)}
                >
                  Edit Profile
                </button>

                <div className="flex flex-col w-full mt-4">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        defaultValue={userData.fullname}
                        className="border mb-4 p-2 rounded w-full"
                        placeholder="Full Name"
                        onChange={(e) =>
                          setUserData({ ...userData, fullname: e.target.value })
                        }
                      />

                      <input
                        type="text"
                        defaultValue={userData.username}
                        className="border mb-4 p-2 rounded w-full"
                        placeholder="Username"
                        onChange={(e) =>
                          setUserData({ ...userData, username: e.target.value })
                        }
                      />

                      <select
                        defaultValue={userData.gender}
                        className="border mb-4 p-2 rounded w-full"
                        onChange={(e) =>
                          setUserData({ ...userData, gender: e.target.value })
                        }
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>

                      <textarea
                        defaultValue={userData.bio}
                        className="border mb-4 p-2 rounded w-full"
                        placeholder="Description"
                        onChange={(e) =>
                          setUserData({ ...userData, bio: e.target.value })
                        }
                      />

                      <button
                        className="bg-primary-600 text-white rounded px-4 py-2"
                        onClick={handleUpdateUser}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                        <span className="font-semibold">Full Name</span>
                        <span>{userData.fullname}</span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                        <span className="font-semibold">Username</span>
                        <span>{userData.username}</span>
                      </div>

                      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                        <span className="font-semibold">Gender</span>
                        <span>{userData.gender}</span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                        <span className="font-semibold">Description</span>
                        <span>{userData.bio}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
