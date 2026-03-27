import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "../Components/LoadingScreen";

const FreeRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const pending = useSelector((state) => state.user.pending);

  if (pending) return <LoadingScreen />;
  if (isAuthenticated) return <Redirect to="/boards" />;

  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
};

export default FreeRoute;
