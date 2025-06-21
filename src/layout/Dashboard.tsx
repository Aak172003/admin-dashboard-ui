import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard Component</h1>
      {/* Outlet is used to render the child component based on the route */}
      <Outlet />
    </div>
  );
};

export default Dashboard;
