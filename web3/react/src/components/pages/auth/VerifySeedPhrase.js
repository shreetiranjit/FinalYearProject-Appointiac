import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import LoadingModal from './LoadingModal';
import { transferFromGodAccount, optIntoProfileContract, optIntoTimeslotContract, createProfileTransaction } from '../../../services/wallet/profile';
const VerifySeedPhrase = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { seedPhrase, indices } = location.state;

  const updateLoadingMessage = (message) => {
    setLoadingMessage(message);
  };
  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value.trim() });
  };
  const handleSubmit = async () => {
    console.log(answers);
    console.log(seedPhrase);
    let isCorrect = true;
    for (let index of indices) {
      // Check if index is within the range of seedPhrase array
      if (index < 0 || index >= seedPhrase.length || answers[index] !== seedPhrase[index]) {
        isCorrect = false;
        break;
      }
      // transfer algorand to this account and then opt in to all the smart contracts
    }

    if (isCorrect) {
      setLoading(true);
      try {
        updateLoadingMessage("Transferring from God account...");
        const transferResp = await transferFromGodAccount();
        console.log(transferResp);

        updateLoadingMessage("Opting into Profile Smart Contract...");
        const profileOptInResp = await optIntoProfileContract();
        console.log(profileOptInResp);

        updateLoadingMessage("Opting into Timeslot Smart Contract...");
        const timeslotOptInResp = await optIntoTimeslotContract();
        console.log(timeslotOptInResp);

        updateLoadingMessage("Creating Profile Smart Contract Transaction...");
        const createProfileTxResp = await createProfileTransaction();
        console.log(createProfileTxResp);

        updateLoadingMessage("Finalizing account creation...");
        toast.success('Account created successfully!');
        // localStorage.setItem("user",json.load({bio: "This is default bio", gender: "Gender", username: "Please Update your profile!", fullname: "Full Name"}))
        navigate('/dashboard');
      } catch (error) {
        console.error("Error during account creation process:", error);
        toast.error("Error during account creation process. Please try again.");
      }
      setLoading(false);
    } else {
      toast.error("Verification failed. Please try again.");
    }
  };


  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoadingModal isLoading={loading} message={loadingMessage} />
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full "> {/* Grey container with padding and rounded corners */}
        <h1 className="text-2xl font-bold mb-4 text-center">Verify Seed Phrase</h1> {/* Centered title */}
        <div>
          {indices.map((index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`word-${index}`} className="block text-sm font-medium text-gray-700">
                Word #{index + 1}
              </label>
              <input
                type="text"
                id={`word-${index}`}
                name={`word-${index}`}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" // Added shadow for the input
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between space-x-4"> {/* Justify buttons */}
          <button
            onClick={handleBack}
            className="bg-black text-white px-4 py-2 rounded hover:bg-black-200 transition flex-grow"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-grow"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default VerifySeedPhrase;