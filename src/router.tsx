import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layout/Dashboard";
import NonAuthorize from "./layout/NonAuthorize";

export const router = createBrowserRouter([
  // 1st Group -> For Authenticated Users
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },

  // 2nd Group -> For Unauthenticated Users
  {
    path: "/auth",
    element: <NonAuthorize />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },

  // {
  //   path: "/auth/login",
  //   element: <LoginPage />,
  // },
]);
