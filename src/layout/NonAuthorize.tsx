import { Outlet } from "react-router-dom";

const NonAuthorize = () => {
  return (
    <div>
      <h1>NonAuthorize Component</h1>
      {/* Outlet is used to render the child component based on the route */}
      <Outlet />
    </div>
  );
};

export default NonAuthorize;
