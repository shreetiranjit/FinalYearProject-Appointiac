import { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { validateAdminToken } from "../../services/admin/adminApi"; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const RequireAdminAuth = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); 


  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          await validateAdminToken(token);
          setIsAuthenticated(true);
        } catch (error) {
          console.log(error);
          localStorage.removeItem('token');
        }
      }else {
        toast.error("Login Expired. Please Log In again.");

        navigate('/admin/login'); 
    }

      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return null; // render null or some loading spinner while waiting for validation
  }

  if (!isAuthenticated) {
    return <Navigate to={'/admin/login'} />;
  }

  return children;
}
