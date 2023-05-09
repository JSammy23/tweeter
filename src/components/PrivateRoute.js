import React from 'react';
import { Route, Navigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from "services/auth";
import Loading from './Loading/Loading';



const PrivateRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <Loading />;
    };

    if (!user) {
      return <Navigate to='/' replace={true} />;
    }

    return children;
};

export default PrivateRoute
