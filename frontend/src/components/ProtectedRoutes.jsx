import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user ? <>{children}</> : null;
};

export default ProtectedRoutes;
