import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateAppointment from './components/pages/appointment/CreateAppointment';
import EditAppointment from './components/pages/appointment/EditAppointment';
import Schedule from './components/pages/navpages/Schedule';
import Analytics from './components/pages/navpages/Analytics';
import Settings from './components/pages/navpages/Settings';
import Messages from './components/pages/navpages/Messages';
import Profile from './components/pages/navpages/Profile';
import AppointmentDetails from './components/pages/appointment/AppointmentDetails';
import { RequireAuth } from './utils/user/RequireAuth';
import Logout from './components/pages/navigation/Logout';
import HomePage from './components/pages/home/HomePage';
import RegisterPage from './components/pages/auth/RegisterPage';
import LoginPage from './components/pages/auth/LoginPage';
import { AuthProvider } from './utils/user/authContext';
import VerifySeedPhrase from './components/pages/auth/VerifySeedPhrase';
import Dashboard from './components/pages/navpages/Dashboard';
import { fetchProfileAppId } from './services/wallet/wallet';


function App() {
  let profileAppId = localStorage.getItem('profileAppId') || 0;
  async function fetchAndCacheAppId() {
    if (profileAppId === 0) {
      // Call backend to get the deployed AppID
      const data = await fetchProfileAppId();
      const appIdFromBackend = parseInt(data, 10); // Parse the AppID to an integer
      if (appIdFromBackend) {
        localStorage.setItem('profileAppId',  appIdFromBackend);
      } 
    }
  }
  
  // Call this function when the app starts
  fetchAndCacheAppId();
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <AuthProvider>
          <Routes>
          <Route path="/register" element={<RegisterPage />} />            
          <Route path="/verify" element={<VerifySeedPhrase />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path='/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path='/create-appointment' element={<RequireAuth><CreateAppointment /></RequireAuth>} />
            <Route path='/appointments/edit/:id' element={<RequireAuth><EditAppointment /></RequireAuth>} />
            <Route path='/schedule' element={<RequireAuth><Schedule /></RequireAuth>} />
            <Route path='/analytics' element={<RequireAuth><Analytics /></RequireAuth>} />
            <Route path='/settings' element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path='/messages' element={<RequireAuth><Messages /></RequireAuth>} />
            <Route path='/profile' element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path='/logout' element={<RequireAuth><Logout /></RequireAuth>} />
            <Route path="/appointment/:id" element={<RequireAuth><AppointmentDetails /></RequireAuth>} />


          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
