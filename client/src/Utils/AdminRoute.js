import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import LoadingScreen from "../Components/LoadingScreen";

const AdminRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.user);
  const { isAuthenticated, userInfo, pending } = user;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (pending) return <LoadingScreen />;
        if (isAuthenticated && userInfo && userInfo.role === 'admin') {
            return <Component {...props} />;
        }
        return <Redirect to="/boards" />;
      }}
    />
  );
};

export default AdminRoute;
