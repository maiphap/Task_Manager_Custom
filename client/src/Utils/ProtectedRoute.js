import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import LoadingScreen from "../Components/LoadingScreen";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const pending = useSelector((state) => state.user.pending);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (pending) return <LoadingScreen />;
        if (isAuthenticated) return <Component {...props} />;
        return <Redirect to="/" />;
      }}
    />
  );
};

export default ProtectedRoute;
