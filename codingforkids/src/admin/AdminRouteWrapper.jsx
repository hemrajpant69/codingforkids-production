import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AdminRouteWrapper = () => {
  const { user } = useContext(UserContext);

  if (!user || user.email.toLowerCase() !== 'hemraj.221506@ncit.edu.np') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Renders nested routes
};

export default AdminRouteWrapper;
