import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const PrivateRoute = ({ children }) => {
    const isAuth = localStorage.getItem('userInfo');
    return isAuth ? children : <Navigate to="/login" />;
  };
  

export default PrivateRoute;