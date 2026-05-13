import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useSelector((store) => store.user);

    // 🔹 If not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 🔹 Admin check (SAFE)
    if (adminOnly && user?.role?.toLowerCase() !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;