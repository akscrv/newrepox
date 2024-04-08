import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

const PrivateRoute = ({ element, allowedRoles, ...rest }) => {


    const isAuthenticated = Cookies.get('accessToken');

    if (!isAuthenticated) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" />;
    }

    const decodedToken = jwtDecode(isAuthenticated);
    const userRole = decodedToken.role;

    // console.log("User Role:", userRole);
    // console.log("User Token:", isAuthenticated);

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to unauthorized page if user's role is not allowed
        return <Navigate to="/unauthorized" />;
    }

    // Render the element directly, without wrapping it in Routes
    return element;
};

export default PrivateRoute;
