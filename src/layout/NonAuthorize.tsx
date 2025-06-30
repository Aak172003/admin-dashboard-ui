import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuthorize = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  if (user !== null) {
    console.log("location", location);
    const returnTo = new URLSearchParams(location.search).get("returnTo");

    return <Navigate to={returnTo || "/"} replace={true} />;
  }

  return (
    <div>
      {/* <h1>NonAuthorize Component</h1> */}
      {/* Outlet is used to render the child component based on the route */}
      <Outlet />
    </div>
  );
};

export default NonAuthorize;
