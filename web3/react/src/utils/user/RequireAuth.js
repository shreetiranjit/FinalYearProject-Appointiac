import { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const RequireAuth = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); 
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('secret');
      const address = localStorage.getItem('address');

      if (token) {
          // validate address to the token
          setIsAuthenticated(true);
      }else {
        toast.error("No token");

        navigate('/'); 
    }
      setIsLoading(false);
    };
    checkAuthentication();
  }, []);

  if (isLoading) {
    return null; // render null or some loading spinner while waiting for validation
  }

  if (!isAuthenticated) {
    return <Navigate to={'/home'} />;
  }
  return children;
}
