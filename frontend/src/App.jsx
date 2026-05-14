import { useState } from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import DashBoard from "./pages/DashBoard";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessful from "./pages/OrderSuccessful";
import ProfileRedirect from "./pages/ProfileRedirect";
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrder from "./pages/admin/AdminOrder";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import OrderDetail from "./pages/admin/OrderDetail";

const router = createBrowserRouter([
  // HOME
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },

  // SIGNUP
  {
    path: "/signup",
    element: <Signup />,
  },

  // LOGIN
  {
    path: "/login",
    element: <Login />,
  },

  // VERIFY
  {
    path: "/verify",
    element: <Verify />,
  },

  // VERIFY EMAIL
  {
    path: "/verify/:token",
    element: <VerifyEmail />,
  },

  // PROFILE REDIRECT
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Navbar />
        <ProfileRedirect />
      </ProtectedRoute>
    ),
  },

  // PROFILE
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
  },

  // SINGLE PRODUCT
  {
    path: "/products/:id",
    element: (
      <>
        <Navbar />
        <SingleProduct />
      </>
    ),
  },

  // PRODUCTS
  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products />
      </>
    ),
  },

  // CART
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Cart />
      </ProtectedRoute>
    ),
  },

  // ADDRESS
  {
    path: "/address",
    element: (
      <ProtectedRoute>
        <Navbar />
        <AddressForm />
      </ProtectedRoute>
    ),
  },

  // PAYMENT
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <Navbar />
        <PaymentPage />
      </ProtectedRoute>
    ),
  },

  // ORDER SUCCESSFUL
  {
    path: "/order-successful",
    element: (
      <ProtectedRoute>
        <Navbar />
        <OrderSuccessful />
      </ProtectedRoute>
    ),
  },

  // ADMIN DASHBOARD
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Navbar />
        <DashBoard />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <AdminSales />,
      },

      {
        path: "sales",
        element: <AdminSales />,
      },

      {
        path: "add-product",
        element: <AddProduct />,
      },

      {
        path: "products",
        element: <AdminProduct />,
      },

      {
        path: "orders",
        element: <AdminOrder />,
      },

      {
        path: "orders/detail/:orderId",
        element: <OrderDetail />,
      },

      {
        path: "orders/:userId",
        element: <ShowUserOrders />,
      },

      {
        path: "users",
        element: <AdminUsers />,
      },

      {
        path: "users/:id",
        element: <UserInfo />,
      },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return <RouterProvider router={router} />;
}

export default App;