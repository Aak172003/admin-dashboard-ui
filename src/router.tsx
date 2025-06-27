import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layout/Dashboard";
import NonAuthorize from "./layout/NonAuthorize";
import Root from "./layout/Root";
import Tenants from "./pages/restaurants/tenants";
import Products from "./pages/products/products";
import Promos from "./pages/promos/promos";
import User from "./pages/users/user";
export const router = createBrowserRouter([
  {
    path: "/",
    // This is the root layout
    element: <Root />,

    children: [
      // 1st Group -> For Authenticated Users
      {
        path: "",
        element: <Dashboard />,

        // These are called protected routes -> And route protection logic is written in Dashboard component
        children: [
          // This will be the default route
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "users",
            element: <User />,
          },
          {
            path: "restaurants",
            element: <Tenants />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "promos",
            element: <Promos />,
          },
        ],
      },

      // 2nd Group -> For Unauthenticated Users
      {
        path: "/auth",
        element: <NonAuthorize />,

        // These are called public routes
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },

  // {
  //   path: "/auth/login",
  //   element: <LoginPage />,
  // },
]);
