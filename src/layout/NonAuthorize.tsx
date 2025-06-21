import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuthorize = () => {
  const { user } = useAuthStore();

  if (user !== null) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div>
      <h1>NonAuthorize Component</h1>
      {/* Outlet is used to render the child component based on the route */}
      <Outlet />
    </div>
  );
};

export default NonAuthorize;
